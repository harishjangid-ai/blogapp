import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { message, receiverId } = req.body;

    if (!senderId || !message || !receiverId) {
      return res.json({ success: false, error: "All fields are required" });
    }

    const participants = [senderId, receiverId].sort();

    let chat = await Chat.findOne({
      participants: { $all: participants, $size: 2 },
    });

    if (!chat) {
      chat = await Chat.create({ participants });
    }

    const msg = await Message.create({
      message,
      senderId,
      chatId: chat._id,
    });
    await Chat.findByIdAndUpdate(msg.chatId, {
      lastMessage: message,
      lastMessageTime: Date.now(),
    });

    return res.json({ success: true, message: "Sended" });
  } catch (error) {
    return res.json({ success: false, error: "Failed to send message" });
  }
};

export const getMyChat = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.id;
    const participants = [senderId, receiverId].sort();

    const chat = await Chat.findOne({
      participants: { $all: participants, $size: 2 },
    }).populate("participants", "userName");

    if (!chat) {
      return res.json(null);
    }

    const messages = await Message.find({ chatId: chat._id });
    res.json(messages || []);
  } catch (error) {
    return res.json({ success: false, error: "Failed to fetch your chat" });
  }
};

export const createNewGroup = async (req, res) => {
  try {
    const creatorId = req.user.userId;
    const { groupName, members } = req.body;
    if (!groupName || !members || members.length < 2) {
      return res.json({
        success: false,
        error: "Group name and at least 2 members are required",
      });
    }
    const participants = [creatorId, ...members].sort();

    const chat = await Chat.create({
      participants,
      isGroup: true,
      groupName,
    });
    return res.json({ success: true, message: "Group created", chatId: chat._id });
  }catch (error) {
    return res.json({ success: false, error: "Failed to create group" });
  }
};
