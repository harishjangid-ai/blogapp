import { Server } from "socket.io";
import http from "http";
import e from "express";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { sendPushNotification } from "../utils/sendPushNotification.js";

const app = e();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const onlineUsers = new Map();

setInterval(() => {
  const now = Date.now();

  onlineUsers.forEach((userData, userId) => {
    const offlineTime = now - userData.lastActive;
    const heartBeatTime = now - userData.lastHeartbeat;

    if (heartBeatTime > 60000 && userData.status !== "offline") {
      userData.status = "offline";
      io.emit("user_status_change", {
        userId,
        status: "offline",
      });
      return;
    }

    if (offlineTime > 4 * 60 * 1000 && userData.status === "online") {
      userData.status = "away";
      io.emit("user_status_change", {
        userId,
        status: "away",
      });
    }
  });
}, 30000);

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
  });
  socket.on("register", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, {
        sockets: new Set(),
        status: "online",
        lastActive: Date.now(),
        lastHeartbeat: Date.now(),
        hidden: false,
      });
    }

    const userData = onlineUsers.get(userId);
    userData.sockets.add(socket.id);
    userData.status = "online";
    userData.lastActive = Date.now();
    userData.lastHeartbeat = Date.now();
    socket.userId = userId;
    const users = [...onlineUsers.entries()].map(([userId, data]) => ({
      userId,
      status: data.status,
    }));
    io.emit("get_online_users", users);
  });
  socket.on("activity", () => {
    const userId = socket.userId;
    if (!userId) return;

    const userData = onlineUsers.get(userId);
    if (!userData) return;

    userData.lastActive = Date.now();

    if (userData.status !== "online") {
      userData.status = "online";

      io.emit("user_status_change", {
        userId,
        status: "online",
      });
    }
  });

  socket.on("heartbeat", () => {
    const userId = socket.userId;
    if (!userId) return;

    const userData = onlineUsers.get(userId);
    if (!userData) return;

    userData.lastHeartbeat = Date.now();
  });

  socket.on("visibility", ({ hidden }) => {
    const userId = socket.userId;
    if (!userId) return;

    const userData = onlineUsers.get(userId);
    if (!userData) return;

    userData.hidden = hidden;

    if (hidden) {
      userData.status = "away";
      io.emit("user_status_change", {
        userId,
        status: "away",
      });
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const { message, receiverId, senderId, chatId } = data;

      let chat;

      if (chatId) {
        chat = await Chat.findById(chatId);

        if (!chat) return;
      } else {
        const participants = [senderId, receiverId].sort();

        chat = await Chat.findOne({
          participants: {
            $all: participants,
            $size: 2,
          },
        });

        if (!chat) {
          chat = await Chat.create({
            participants,
          });

          const senderData = onlineUsers.get(senderId);

          const receiverData = onlineUsers.get(receiverId);
          const shouldPush = !receiverData || receiverData.hidden;
          if (shouldPush && receiver?.fcmToken) {
            await sendPushNotification({
              token: receiver.fcmToken,
              title: sender?.fullName || "New Message",
              body: message,
              data: {
                chatId: chat._id.toString(),
                senderId: senderId.toString(),
              },
            });
          }

          if (senderData) {
            io.to([...senderData.sockets]).emit(
              "chat_created",
              chat._id.toString(),
            );
          }

          if (receiverData) {
            io.to([...receiverData.sockets]).emit(
              "chat_created",
              chat._id.toString(),
            );
          }
        }
      }

      const chatRoom = chat._id.toString();

      socket.join(chatRoom);
      const newMsg = await Message.create({
        message,
        senderId,
        chatId: chat._id,
        readBy: [senderId],
      });

      await Chat.findByIdAndUpdate(chatRoom, {
        lastMessage: message,
        lastMessageTime: Date.now(),
      });

      if (!chat.isGroup && receiverId) {
        const receiver = await User.findById(receiverId);
        const sender =
          await User.findById(senderId).select("fullName userName");

        const receiverData = onlineUsers.get(receiverId);

        const shouldPush =
          !receiverData ||
          receiverData.hidden ||
          receiverData.status === "away";
       
        if (shouldPush && receiver?.fcmToken) {

          await sendPushNotification({
            token: receiver.fcmToken,
            title: sender?.fullName || "New Message",
            body: message,
            data: {
              chatId: chat._id.toString(),
              senderId: senderId.toString(),
            },
          });
        }
      }

      if (chat.isGroup) {
        const sender = await User.findById(senderId).select("fullName");

        const users = await User.find({
          _id: {
            $in: chat.participants.filter((id) => id.toString() !== senderId),
          },
        });

        const tokens = users
          .filter((u) => !onlineUsers.has(u._id.toString()) && u.fcmToken)
          .map((u) => u.fcmToken);

        if (tokens.length) {
          await sendPushNotification({
            tokens,
            title: `${sender?.fullName || "Someone"} in ${chat.groupName || "Group"}`,
            body: message,
            data: {
              chatId: chat._id.toString(),
              senderId: senderId.toString(),
            },
          });
        }
      }
      io.to(chatRoom).emit("receive_message", newMsg);
    } catch (err) {
      console.log("Socket error:", err);
    }
  });

  socket.on("delete_message", async ({ messageId, senderId }) => {
    try {
      const message = await Message.findOne({
        _id: messageId,
        senderId,
      });

      if (!message) {
        return socket.emit("delete_message_response", {
          success: false,
          error: "Message not found or unauthorized",
        });
      }

      await Message.findByIdAndDelete(messageId);

      const chatRoom = message.chatId.toString();

      io.to(chatRoom).emit("message_deleted", {
        messageId,
      });
    } catch (err) {
      console.log("Delete message error:", err);

      socket.emit("delete_message_response", {
        success: false,
        error: "An error occurred while deleting the message",
      });
    }
  });

  socket.on("mark_read", async ({ chatId, userId }) => {
    try {
      await Message.updateMany(
        {
          chatId,
          senderId: { $ne: userId },
          readBy: { $ne: userId },
        },
        {
          $addToSet: {
            readBy: userId,
          },
        },
      );

      io.to(chatId).emit("messages_read", {
        chatId,
        userId,
      });
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("typing", ({ chatId, userId }) => {
    socket.to(chatId).emit("user_typing", {
      chatId,
      userId,
    });
  });

  socket.on("stop_typing", ({ chatId, userId }) => {
    socket.to(chatId).emit("user_stop_typing", {
      chatId,
      userId,
    });
  });

  socket.on("disconnect", () => {
    const userId = socket.userId;
    if (!userId) return;

    const userData = onlineUsers.get(userId);
    if (!userData) return;

    userData.sockets.delete(socket.id);

    if (userData.sockets.size === 0) {
      onlineUsers.delete(userId);

      io.emit("user_status_change", {
        userId,
        status: "offline",
      });
    }

    const users = [...onlineUsers.entries()].map(([userId, data]) => ({
      userId,
      status: data.status,
    }));

    io.emit("get_online_users", users);
  });
});

export { server, app };
