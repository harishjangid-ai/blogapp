import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import Group from "../models/groupModal.js";
import User from "../models/userModel.js";
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
    const userId = req.user.userId;
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.json([]);
    }

    const isParticipant = chat.participants.some(
      (participant) => participant.toString() === userId,
    );

    if (!isParticipant) {
      return res.json({
        success: false,
        error: "Unauthorized",
      });
    }

    const messages = await Message.find({ chatId })
      .populate("senderId", "_id fullName userName")
      .sort({ createdAt: 1 });

    const formatedMassages = messages.map((m) => ({
      _id: m._id,
      sender: {
        _id: m.senderId._id,
        fullName: m.senderId.fullName,
        userName: m.senderId.userName,
      },
      message: m.message,
      chatId: m.chatId,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));

    return res.json(formatedMassages);
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error: "Failed to fetch your chat",
    });
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

    const participants = [...new Set([creatorId, ...members])].sort();

    const chat = await Chat.create({
      participants,
      isGroup: true,
    });

    const group = await Group.create({
      chatId: chat._id,
      groupName,
      creator: creatorId,
    });

    return res.json({
      success: true,
      message: "Group created",
      chatId: chat._id,
      groupId: group._id,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error: "Failed to create group",
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const creatorId = req.user.userId;
    const { groupId } = req.body;
    if (!creatorId || !groupId) {
      return res.json({
        success: false,
        error: "Please select a group to delete",
      });
    }
    const group = await Group.findOneAndDelete({ _id: groupId });
    if (group) {
      const chat = await Chat.findOneAndDelete({ _id: group.chatId });
      await Message.deleteMany({ chatId: chat._id });
      return res.json({ success: true, message: "Group deleted succefully" });
    }
    return res.json({ success: false, error: "Failed" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const removeUserFromGroup = async (req, res) => {
  try {
    const creatorId = req.user.userId;
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.json({ success: false, error: "Chat not found" });
    }

    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { participants: userId },
      },
      { new: true },
    );

    return res.json({ success: true, message: "User removed" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const exitGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { chatId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.json({ success: false, error: "Chat not found" });
    }

    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { participants: userId },
      },
      { new: true },
    );

    return res.json({ success: true, message: "Exited from group" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const addMoreUsersList = async (req, res) => {
  try {
    const { chatId } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.json({
        success: false,
        error: "Chat not found",
      });
    }

    const users = await User.find({
      _id: { $nin: chat.participants },
      role: { $ne: "admin" },
    }).select("_id userName fullName");

    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const addMoreUsers = async (req, res) => {
  try {
    const { chatId, members } = req.body;
    if (!chatId || !members) {
      return res.json({ success: false, error: "Failed to add users" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.json({ success: false, error: "Chat not found" });
    }

    const newMembers = [...new Set([...chat.participants, ...members])];
    await Chat.findByIdAndUpdate(chatId, {
      participants: newMembers,
    });

    return res.json({ success: true, message: "Users added succefully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};
