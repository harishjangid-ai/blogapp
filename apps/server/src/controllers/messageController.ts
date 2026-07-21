import { AuthenticatedRequest } from './../types/RequestType';
import { Request, Response } from "express";
import Chat from "../models/chatModel.ts";
import Message from "../models/messageModel.ts";
import Group from "../models/groupModal.ts";
import User from "../models/userModel.ts";

export const sendMessage = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const senderId = req.user?.userId;
    const { message, chatId } = req.body;

    if (!senderId) {
      return res.json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (!message || !chatId) {
      return res.json({
        success: false,
        error: "All fields are required",
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.json({
        success: false,
        error: "Chat not found",
      });
    }

    const newMsg = await Message.create({
      message,
      senderId,
      chatId: chat._id,
      readBy: [senderId],
    });

    await Chat.findByIdAndUpdate(chat._id, {
      lastMessage: message,
      lastMessageTime: Date.now(),
    });

    return res.json({
      success: true,
      newMsg,
    });
  } catch (err) {
    console.log("Message error:", err);
    return res.json({
      success: false,
      err,
    });
  }
};

export const getMyChat = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.json([]);
    }

    const isParticipant = chat.participants.some(
      (participant: any) => participant.toString() === userId,
    );

    if (!isParticipant) {
      return res.json({
        success: false,
        error: "Unauthorized",
      });
    }

    const messages = await Message.find({ chatId })
      .populate("senderId", "_id fullName userName image")
      .populate("readBy", "_id fullName userName")
      .sort({ createdAt: 1 });

    const formatedMassages = messages.map((m: any) => ({
      _id: m._id,
      sender: {
        _id: m.senderId._id,
        fullName: m.senderId.fullName,
        userName: m.senderId.userName,
        image: m.senderId.image,
      },
      message: m.message,
      imageUrl: m.imageUrl,
      chatId: m.chatId,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      readBy: m.readBy
        .filter(
          (user: any) =>
            user._id.toString() !== m.senderId._id.toString(),
        )
        .map((user: any) => ({
          _id: user._id,
          fullName: user.fullName,
          userName: user.userName,
        })),
      readed: m.readBy.length,
      participantCount: chat.participants.length,
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

export const createNewGroup = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const creatorId = req.user?.userId;

    const { groupName, imageUrl, members } = req.body;

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
      imageUrl,
      // admins: []
    });

    return res.json({
      success: true,
      message: "Group created",
      chatId: chat._id,
      groupId: group._id,
      imageUrl: group.imageUrl,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error: "Failed to create group",
    });
  }
};

export const deleteGroup = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const creatorId = req.user?.userId;
    const { groupId } = req.body;

    if (!creatorId || !groupId) {
      return res.json({
        success: false,
        error: "Please select a group to delete",
      });
    }

    const group = await Group.findByIdAndDelete(groupId);

    if (group) {
      const chat = await Chat.findByIdAndDelete(group.chatId);

      if (chat) {
        await Message.deleteMany({
          chatId: chat._id,
        });
      }

      return res.json({
        success: true,
        message: "Group deleted successfully",
      });
    }

    return res.json({
      success: false,
      error: "Failed",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error,
    });
  }
};

export const removeUserFromGroup = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.json({
        success: false,
        error: "Chat not found",
      });
    }

    await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          participants: userId,
        },
      },
      {
        new: true,
      },
    );

    return res.json({
      success: true,
      message: "User removed",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error,
    });
  }
};

export const exitGroup = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { chatId } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.json({
        success: false,
        error: "Chat not found",
      });
    }

    await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          participants: userId,
        },
      },
      {
        new: true,
      },
    );

    return res.json({
      success: true,
      message: "Exited from group",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error,
    });
  }
};

export const addMoreUsersList = async ( req: Request, res: Response ): Promise<Response> => {
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
      _id: {
        $nin: chat.participants,
      },
      role: {
        $ne: "admin",
      },
    }).select("_id userName fullName image");

    return res.json(users);
  } catch (error: any) {
    console.log(error);

    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const addMoreUsers = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const { chatId, members } = req.body;

    if (!chatId || !members) {
      return res.json({
        success: false,
        error: "Failed to add users",
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.json({
        success: false,
        error: "Chat not found",
      });
    }

    const newMembers = [...new Set([...chat.participants, ...members])];

    await Chat.findByIdAndUpdate(chatId, {
      participants: newMembers,
    });

    return res.json({
      success: true,
      message: "Users added successfully",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const updateAdmin = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const { groupId, newAdminId } = req.body;

    if (!groupId || !newAdminId) {
      return res.json({
        success: false,
        error: "Group and new admin selection is required",
      });
    }

    await Group.findByIdAndUpdate(groupId, {
      creator: newAdminId,
    });

    return res.json({
      success: true,
      message: "Admin switched",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const deleteMessage = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { msgId } = req.body;

    if (!msgId) {
      return res.json({
        success: false,
        error: "please select a message",
      });
    }

    const msg = await Message.findOne({
      senderId: userId,
      _id: msgId,
    });

    if (msg) {
      const message = await Message.findByIdAndDelete(msgId);

      return res.json({
        success: true,
        message: "Message deleted",
        msg: message,
      });
    }

    return res.json({
      success: false,
      error: "You are not able to delete this message",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const editGroupDetails = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { groupId, groupName, imageUrl } = req.body;

    if (!groupId || !groupName) {
      return res.json({
        success: false,
        error: "please fill in all fields",
      });
    }

    const group = await Group.findOne({
      _id: groupId,
      creator: userId,
    });

    if(group?.creator?.toString() !== userId){
      return res.json({
        success: false,
        error: "You are not able to edit this group",
      });
    }

    if (group?.creator?.toString() === userId) {
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { groupName, imageUrl },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Group details updated",
        group: updatedGroup,
      });
    }

    return res.json({
      success: false,
      error: "You are not able to edit this group",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};