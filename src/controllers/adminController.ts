import { Request, Response } from "express";
import User from "../models/User";
import { z } from "zod";
import { UserRole } from "../utils/enums";
import { registerSchema } from "../utils/zodValidation";
import bcrypt from "bcryptjs";

//(Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//(Admin only)
export const createNewUser = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, role } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const newUser = await User.create({ name, email, password, role });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//(Admin only)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { name, email, role, password } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User updated successfully", user });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//(Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
