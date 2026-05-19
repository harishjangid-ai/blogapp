import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  try {
    const { userName, password, fullName, phone } = req.body;
    if (!userName || !password || !fullName || !phone) {
      return res.json({ success: false, error: "All fields are required" });
    }
    const userNameExist = await User.findOne({ userName });
    if (userNameExist) {
      return res.json({ success: false, error: "This username is already taken by another user" });
    }

    const phoneExist = await User.findOne({ phone });
    if (phoneExist) {
      return res.json({ success: false, error: "This Phone number is already taken by another user" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      userName,
      password: hashedPassword,
      phone
    });

    return res.json({ success: true, message: "Sign up completed" });
  } catch (error) {
    return res.json({ success: false, error: "Sign up failed" });
  }
};
