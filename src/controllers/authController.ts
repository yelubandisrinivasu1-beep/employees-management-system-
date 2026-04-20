import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import AuthLog from "../models/authLogModel";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }

const existingUser = await User.findOne({
  email: email.toLowerCase(),
});
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
      return;
    }

const user = await User.findOne({
  email: email.toLowerCase(),
});

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Create Login Audit Record
    await AuthLog.create({
      user: user._id,
      action: "login",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // AuthRequest attaches req.user
    const userId = (req as any).user?.userId || (req as any).user?.id;
    if (userId) {
      await AuthLog.create({
        user: userId,
        action: "logoff",
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"],
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch(error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAuthLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await AuthLog.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch(error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyAuthLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const logs = await AuthLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch(error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      res.status(400).json({ success: false, message: "Please provide email and new password" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch(error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};