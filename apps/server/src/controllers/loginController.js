import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.json({
        success: false,
        error: "Invalid username or password",
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.json({
        success: false,
        error: "Invalid username or password",
      });
    }

    const tokenData = {
      userId: user._id,
      userName: user.userName,
      fullName: user.fullName,
      role: user.role,
    };
    const secretKey = process.env.JWT_SECRET;
    jwt.sign(tokenData, secretKey, { expiresIn: "2d" }, (err, token) => {
      if (err) {
        return res.json({
          success: false,
          error: "Token generation failed",
        });
      }
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });
      return res.send({
        success: true,
        message: "Login successful",
        token: token,
        user: {
          _id: user._id,
          userName: user.userName,
          fullName: user.fullName,
          role: user.role,
        },
      });
    });
  } catch (error) {
    return res.json({ success: false, error: "login failed" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userDet = await User.find({ _id: userId });

    return res.json({
      success: true,
      user: userDet[0] || null,
    });
  } catch (error) {
    return res.json({ success: false, error: "Failed to fetch user details" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.json({
      success: true,
      message: "Logged out successful",
    });
  } catch (error) {
    return res.json({ success: false, error: "Logout failed" });
  }
};
