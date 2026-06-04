import User from "../models/userModel.js";
import Blog from "../models/blogModel.js";
import Like from "../models/likesModel.js";
import Report from "../models/reportsModel.js";
import Chat from "../models/chatModel.js";

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
    const chat = await Chat.find({ participants: loggedInUserId }).sort({
      lastMessageTime: -1,
    });
    const otherUsersId = chat.map((t) => {
      const otherUserId = t.participants.find(
        (p) => p.toString() !== loggedInUserId,
      );
      return otherUserId ? otherUserId.toString() : null;
    });

    const users = await User.find({
      _id: { $nin: [loggedInUserId, ...otherUsersId] },
      role: "user",
    }).select("-password");

    const finalUsers = await User.find({ _id: { $in: otherUsersId } }).select(
      "-password",
    );
    const orderedUsers = otherUsersId.map((id) => {
      return finalUsers.find((user) => user._id.toString() === id);
    });
    const allUsers = [...orderedUsers, ...users];
    return res.json(allUsers);
  } catch (error) {
    console.log(error)
    return res.json({ success: false, error: "Failed to fetch users" });
  }
};

export const getSelectedUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    return res.json({
      fullName: user.fullName,
      userName: user.userName,
      _id: user._id,
    });
  } catch (error) {
    return res.json({
      success: false,
      error: "Failed to get selected user's details",
    });
  }
};
