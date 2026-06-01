import User from "../models/userModel.js";
import Blog from "../models/blogModel.js";
import Like from "../models/likesModel.js";
import Report from "../models/reportsModel.js";

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
    const userId = req.user.userId;

    const user = await User.find({_id: {$ne: userId}}).select("-password");

    return res.json(user);
  } catch (error) {
    return res.json({ success: false, error });
  }
};