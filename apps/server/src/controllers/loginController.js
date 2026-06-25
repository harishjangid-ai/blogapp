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

    const accessToken = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(tokenData, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 10 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      error: "Login failed",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userDet = await User.findById(userId);

    return res.json({
      success: true,
      user: userDet,
    });
  } catch (error) {
    return res.json({ success: false, error: "Failed to fetch user details" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { $set: { refreshToken: null } },
      );
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "Logged out successful",
    });
  } catch (error) {
    return res.json({
      success: false,
      error: "Logout failed",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;
    if (!oldPassword || !newPassword || !userId) {
      return res.json({
        success: false,
        error: "Please enter your password first",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        error: "Invalid user",
      });
    }

    const checkPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkPassword) {
      return res.json({
        success: false,
        error: "Wrong password please try again",
      });
    }

    const checkSamePassword = await bcrypt.compare(newPassword, user.password);
    if (checkSamePassword) {
      return res.json({
        success: false,
        error: "Old and new password never same",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      refreshToken: null,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const token = req.cookies.token;
    if(token){
      return res.json({message: "Token is valid"})
    }
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "Refresh token not found",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken != refreshToken) { 
      return res.status(403).json({
        success: false,
        error: "Invalid refresh token",
      });
    }

    const tokenData = {
      userId: user._id,
      userName: user.userName,
      fullName: user.fullName,
      role: user.role,
    };

    const accessToken = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 10 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed",
      token: accessToken,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Invalid refresh token",
    });
  }
};