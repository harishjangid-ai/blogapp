import User from "../models/userModel.js";
import Blog from "../models/blogModel.js";
import Like from "../models/likesModel.js";
import Report from "../models/reportsModel.js";
import Chat from "../models/chatModel.js";
import Group from "../models/groupModal.js";
import Message from "../models/messageModel.js";

export const userList = async (req, res) => {
  try {
    const user = await User.find().select("-password");

    return res.json(user);
  } catch (error) {
    return res.json({ success: false, error });
  }
};

export const admins = async (req, res) => {
  try {
    const user = await User.find({ role: "admin" }).select("-password");

    return res.json(user);
  } catch (error) {
    return res.json({ success: false, error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.json({
        success: false,
        error: "user not found",
      });
    }

    const blogs = await Blog.find({ userId: user._id });

    const blogIds = blogs.map((b) => b._id);
    await Like.deleteMany({ blogId: { $in: blogIds } });
    await Report.deleteMany({ blogId: { $in: blogIds } });
    await Blog.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const chatUserList = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;

    const chats = await Chat.find({
      participants: loggedInUserId,
    }).sort({
      lastMessageTime: -1,
    });

    const result = [];

    for (const chat of chats) {
      if (chat.isGroup) {
        const group = await Group.findOne({
          chatId: chat._id,
        });

        if (group) {
          const unreadCount = await Message.countDocuments({
            chatId: chat._id,
            senderId: { $ne: loggedInUserId },
            readBy: { $ne: loggedInUserId },
          });
          result.push({
            _id: group._id,
            chatId: chat._id,
            isGroup: true,
            groupName: group.groupName,
            lastMessage: chat.lastMessage,
            lastMessageTime: chat.lastMessageTime,
            unreadCount,
          });
        }
        continue;
      }
      const otherUserId = chat.participants.find(
        (p) => p.toString() !== loggedInUserId,
      );

      if (!otherUserId) continue;

      const user = await User.findById(otherUserId).select("-password");

      if (user) {
        const unreadCount = await Message.countDocuments({
          chatId: chat._id,
          senderId: { $ne: loggedInUserId },
          readBy: { $ne: loggedInUserId },
        });

        result.push({
          ...user.toObject(),
          chatId: chat._id,
          isGroup: false,
          lastMessage: chat.lastMessage,
          lastMessageTime: chat.lastMessageTime,
          unreadCount,
        });
      }
    }
    const existingUserIds = chats
      .filter((c) => !c.isGroup)
      .map((chat) =>
        chat.participants
          .find((p) => p.toString() !== loggedInUserId)
          ?.toString(),
      );

    const remainingUsers = await User.find({
      _id: {
        $nin: [loggedInUserId, ...existingUserIds],
      },
      role: "user",
    }).select("-password");

    const allUsers = [
      ...result,
      ...remainingUsers.map((u) => ({
        ...u.toObject(),
        isGroup: false,
        chatId: undefined,
      })),
    ];

    return res.json(allUsers);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: "Failed to fetch users",
    });
  }
};

export const getSelectedUser = async (req, res) => {
  try {
    const id = req.params.id;

    const group = await Group.findById(id)
      .populate("creator", "_id fullName userName phone")
      .populate({
        path: "chatId",
        select: "_id participants",
        populate: {
          path: "participants",
          select: "_id fullName userName phone",
        },
      });

    if (group) {
      return res.json({
        _id: group._id,
        groupName: group.groupName,
        isGroup: true,
        creator: {
          _id: group.creator._id,
          fullName: group.creator.fullName,
          userName: group.creator.userName,
          phone: group.creator.phone,
        },
        chat: {
          _id: group.chatId._id,
          members: group.chatId.participants,
        },
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.json({
        success: false,
        error: "Not found",
      });
    }

    return res.json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      phone: user.phone,
      isGroup: false,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: "Failed to get selected user's details",
    });
  }
};

export const users = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.json({
        success: false,
        error: "User id is not available please login first than come here",
      });
    }
    const userList = await User.find({
      _id: { $ne: userId },
      role: { $ne: "admin" },
    }).select("-password");
    return res.json(userList);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};


export const saveFcmToken = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { token } = req.body;
    

    await User.findByIdAndUpdate(userId, {
      fcmToken: token,
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};