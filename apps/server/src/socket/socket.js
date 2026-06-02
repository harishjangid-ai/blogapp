import { Server } from "socket.io";
import http from "http";
import e from "express";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

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

    if ((heartBeatTime > 60000) & (userData.status !== "offline")) {
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
      const { message, receiverId, senderId } = data;

      const participants = [senderId, receiverId].sort();

      let chat = await Chat.findOne({
        participants: {
          $all: participants,
          $size: 2,
        },
      });

      if (!chat) {
        chat = await Chat.create({
          participants,
        });

        socket.join(chat._id.toString());
      }

      const chatRoom = chat._id.toString();

      socket.join(chatRoom);

      const senderData = onlineUsers.get(senderId);

      const receiverData = onlineUsers.get(receiverId);

      if (senderData) {
        io.to([...senderData.sockets]).emit("chat_created", chatRoom);
      }

      if (receiverData) {
        io.to([...receiverData.sockets]).emit("chat_created", chatRoom);
      }

      const newMsg = await Message.create({
        message,
        senderId,
        chatId: chat._id,
      });

      await Chat.findByIdAndUpdate(chatRoom, {
        lastMessageTime: Date.now(),
        lastMessage: message,
      });

      io.to(chat._id.toString()).emit("receive_message", newMsg);
    } catch (err) {
      console.log("Socket error:", err);
    }
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

    const users = [...onlineUsers.entries()].map((userId, data) => ({
      userId,
      status: data.status,
    }));

    io.emit("get_online_users", users);
  });
});

export { server, app };
