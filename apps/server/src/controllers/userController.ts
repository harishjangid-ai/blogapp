import User from "../models/userModel.ts";
import Blog from "../models/blogModel.ts";
import Like from "../models/likesModel.ts";
import Report from "../models/reportsModel.ts";
import Chat from "../models/chatModel.ts";
import Group from "../models/groupModal.ts";
import Message from "../models/messageModel.ts";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/RequestType.ts";

const escapeRegex = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const userList = async (req: Request, res: Response): Promise<Response> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string)?.trim() || "";
    const escapedSearch = escapeRegex(search);

    const skip = (page - 1) * limit;

    const filter = escapedSearch
      ? {
          $or: [
            {
              fullName: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              userName: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              role: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const user = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(filter);

    return res.json({
      user,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      hasMore: page * limit < totalUsers,
      totalUsers,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const admins = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const user = await User.find({
      role: "admin",
    }).select("-password");

    return res.json(user);
  } catch (error) {
    return res.json({
      success: false,
      error,
    });
  }
};

export const deleteUser = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.json({
        success: false,
        error: "user not found",
      });
    }

    if (user.role === "admin") {
      return res.json({
        success: false,
        error: "Can not delete the admin",
      });
    }

    const blogs = await Blog.find({
      userId: user._id,
    });

    const blogIds = blogs.map((b: any) => b._id);

    await Like.deleteMany({
      blogId: {
        $in: blogIds,
      },
    });

    await Report.deleteMany({
      blogId: {
        $in: blogIds,
      },
    });

    await Blog.deleteMany({
      userId: user._id,
    });

    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error: any) {
    console.log(error);

    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const chatUserList = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const search = (req.query.search as string)?.trim().toLowerCase() || "";

    const skip = (page - 1) * limit;

    const loggedInUserId = req.user?.userId;

    const chats = await Chat.find({
      participants: loggedInUserId,
    }).sort({
      lastMessageTime: -1,
    });

    const result: any[] = [];

    for (const chat of chats) {
      if (chat.isGroup) {
        const group = await Group.findOne({
          chatId: chat._id,
        });

        if (group) {
          const unreadCount = await Message.countDocuments({
            chatId: chat._id,
            senderId: {
              $ne: loggedInUserId,
            },
            readBy: {
              $ne: loggedInUserId,
            },
          });

          result.push({
            _id: group._id,
            chatId: chat._id,
            isGroup: true,
            groupName: group.groupName,
            lastMessage: chat.lastMessage,
            lastMessageTime: chat.lastMessageTime,
            image: group.imageUrl,
            unreadCount,
          });
        }

        continue;
      }

      const otherUserId = chat.participants.find(
        (p: any) => p.toString() !== loggedInUserId,
      );

      if (!otherUserId) continue;

      const user = await User.findById(otherUserId).select("-password");

      if (user) {
        const unreadCount = await Message.countDocuments({
          chatId: chat._id,
          senderId: {
            $ne: loggedInUserId,
          },
          readBy: {
            $ne: loggedInUserId,
          },
        });

        result.push({
          ...user.toObject(),
          chatId: chat._id,
          isGroup: false,
          lastMessage: chat.lastMessage,
          lastMessageTime: chat.lastMessageTime,
          unreadCount,
          image: user.image
        });
      }
    }

    const existingUserIds = chats
      .filter((c) => !c.isGroup)
      .map((chat) =>
        chat.participants
          .find((p: any) => p.toString() !== loggedInUserId)
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

    const filteredUsers = search
      ? allUsers.filter((user: any) =>
          [
            user.fullName,
            user.groupName,
            user.userName,
            user.phone,
          ]
            .filter(Boolean)
            .some((field: string) =>
              field.toLowerCase().includes(search),
            ),
        )
      : allUsers;

    const totalUsers = filteredUsers.length;

    const paginatedUsers = filteredUsers.slice(
      skip,
      skip + limit,
    );

    return res.json({
      users: paginatedUsers,
      currentPage: page,
      hasMore: page * limit < totalUsers,
      totalUsers,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
};

export const getSelectedUser = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const id = req.params.id;

    const group = await Group.findById(id)
      .populate("creator", "_id fullName userName phone image")
      .populate({
        path: "chatId",
        select: "_id participants",
        populate: {
          path: "participants",
          select: "_id fullName userName phone image",
        },
      });

    if (group) {
      const populatedGroup = group as any;
      return res.json({
        _id: populatedGroup._id,
        groupName: populatedGroup.groupName,
        isGroup: true,
        image: populatedGroup.imageUrl,
        creator: {
          _id: populatedGroup.creator._id,
          fullName: populatedGroup.creator.fullName,
          userName: populatedGroup.creator.userName,
          phone: populatedGroup.creator.phone,
          image: populatedGroup.creator.image,
        },
        chat: {
          _id: populatedGroup.chatId._id,
          members: populatedGroup.chatId.participants,
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
      image: user.image,
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

export const users = async (req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.json({
        success: false,
        error: "User id is not available please login first than come here",
      });
    }

    const userList = await User.find({
      _id: {
        $ne: userId,
      },
      role: {
        $ne: "admin",
      },
    }).select("-password");

    return res.json(userList);
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const saveFcmToken = async (req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { token } = req.body;

    await User.findByIdAndUpdate(userId, {
      fcmToken: token,
    });

    return res.json({
      success: true,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const userCount = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const count = await User.countDocuments({
      role: "user",
    });

    return res.json(count);
  } catch (error: any) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const editUser = async (req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const { userName, fullName, phone, imageUrl } = req.body;
    const userId = req.user?.userId;

    if (!userName || !fullName || !phone) {
      return res.json({
        success: false,
        error: "All fields are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        error: "User not found",
      });
    }

    const userNameExist = await User.findOne({
      userName,
      _id: {
        $ne: userId,
      },
    });

    if (userNameExist) {
      return res.json({
        success: false,
        error: "User name already used",
      });
    }

    const phoneExist = await User.findOne({
      phone,
      _id: {
        $ne: userId,
      },
    });

    if (phoneExist) {
      return res.json({
        success: false,
        error: "Phone number already used",
      });
    }

    const newUser = await User.findByIdAndUpdate(
      userId,
      {
        userName,
        fullName,
        phone,
        image: imageUrl
      },
      {
        new: true,
      },
    );

    return res.json({
      success: true,
      message: "User details updated",
      user: newUser,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};