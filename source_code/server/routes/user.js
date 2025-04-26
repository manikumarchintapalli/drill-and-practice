

import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/userSchema.js";

const userRouter = Router();

// 🛠️ Utility to catch invalid ObjectId errors
const isInvalidObjectId = (error) => error instanceof mongoose.Error.CastError;

// ✅ USER Sign-In
userRouter.post("/user/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send("User not found.");
    if (user.role !== "user") return res.status(403).send("Only users can log in here.");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).send("Invalid Email / Password");

    return res.send(user.generateJWTToken());
  } catch (error) {
    console.error("❌ Sign-in error:", error.message);
    return res.status(500).send("Unknown error occurred!!");
  }
});

// ✅ ADMIN Sign-In
userRouter.post("/admin/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email });

    if (!admin) return res.status(404).send("Admin not found.");
    if (admin.role !== "admin") return res.status(403).send("Only admins can log in here.");

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).send("Invalid Email / Password");

    return res.send(admin.generateJWTToken());
  } catch (error) {
    console.error("❌ Admin Sign-in error:", error.message);
    return res.status(500).send("Unknown error occurred!!");
  }
});

// ✅ Sign-Up
userRouter.post("/user/sign-up", async (req, res) => {
  try {
    const { email, password, confirmPassword, username, phoneNo, dob, role } = req.body;

    if (!email || !password || !confirmPassword || !username || !phoneNo || !dob) {
      return res.status(400).send("All fields are required.");
    }

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists.");

    const newUser = await User.create({
      email,
      password,
      username,
      phoneNo,
      dob,
      role: role === "admin" ? "admin" : "user",
    });

    return res.status(201).send(newUser.generateJWTToken());
  } catch (error) {
    console.error("❌ Signup error:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ GET Profile
userRouter.get("/user/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, { password: 0 });
    if (!user) return res.status(400).send("No user found with given id");
    return res.json(user);
  } catch (error) {
    if (isInvalidObjectId(error)) {
      return res.status(400).send("Invalid user ID format");
    }
    console.error("❌ Fetch profile error:", error.message);
    return res.status(500).send("Something unexpected happened");
  }
});

// ✅ PUT: Update Profile
userRouter.put("/user/profile/:userId", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).send("User not found.");
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (isInvalidObjectId(error)) {
      return res.status(400).send("Invalid user ID format");
    }
    console.error("❌ Update error:", error.message);
    return res.status(500).send("Something unexpected happened");
  }
});

// ✅ DELETE: Delete Profile
userRouter.delete("/user/profile/:userId", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) return res.status(404).send("User not found.");
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    if (isInvalidObjectId(error)) {
      return res.status(400).send("Invalid user ID format");
    }
    console.error("❌ Delete error:", error.message);
    return res.status(500).send("Something unexpected happened");
  }
});

export default userRouter;