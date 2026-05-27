import User from "../models/userModel.js";
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
