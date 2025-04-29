

// import { Router } from "express";
// import mongoose from "mongoose";
// import User from "../models/userSchema.js";

// const userRouter = Router();
// const isInvalidObjectId = (err) => err instanceof mongoose.Error.CastError;

// // USER Sign-In
// userRouter.post("/user/sign-in", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).send("User not found.");
//     if (user.role !== "user") return res.status(403).send("Only users can log in here.");

//     const match = await user.comparePassword(password);
//     if (!match) return res.status(400).send("Invalid email or password.");

//     return res.send(user.generateJWTToken());
//   } catch (err) {
//     console.error("❌ Sign-in error:", err.message);
//     res.status(500).send("Unknown error occurred.");
//   }
// });

// // ADMIN Sign-In
// userRouter.post("/admin/sign-in", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const admin = await User.findOne({ email });
//     if (!admin) return res.status(404).send("Admin not found.");
//     if (admin.role !== "admin") return res.status(403).send("Only admins can log in here.");

//     const match = await admin.comparePassword(password);
//     if (!match) return res.status(400).send("Invalid email or password.");

//     return res.send(admin.generateJWTToken());
//   } catch (err) {
//     console.error("❌ Admin sign-in error:", err.message);
//     res.status(500).send("Unknown error occurred.");
//   }
// });

// // USER Sign-Up
// userRouter.post("/user/sign-up", async (req, res) => {
//   try {
//     const { email, password, confirmPassword, username, phoneNo, dob, role } = req.body;
//     if (!email || !password || !confirmPassword || !username || !phoneNo || !dob) {
//       return res.status(400).send("All fields are required.");
//     }
//     if (password !== confirmPassword) {
//       return res.status(400).send("Passwords do not match.");
//     }

//     // 1) Check username
//     if (await User.exists({ username })) {
//       return res.status(409).send("Username already taken");
//     }
//     // 2) Check email
//     if (await User.exists({ email })) {
//       return res.status(409).send("Email already registered");
//     }

//     const newUser = await User.create({
//       username,
//       email,
//       password,
//       phoneNo,
//       dob,
//       role: role === "admin" ? "admin" : "user",
//     });

//     return res.status(201).send(newUser.generateJWTToken());
//   } catch (err) {
//     console.error("❌ Signup error:", err);
//     // Handle duplicate‐key error if it sneaks through
//     if (err.code === 11000) {
//       const field = Object.keys(err.keyPattern)[0];
//       return res.status(409).send(`${field} already taken`);
//     }
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// });

// // GET Profile
// userRouter.get("/user/profile/:userId", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId, "-password");
//     if (!user) return res.status(404).send("User not found.");
//     res.json(user);
//   } catch (err) {
//     if (isInvalidObjectId(err)) return res.status(400).send("Invalid user ID format");
//     console.error("❌ Fetch profile error:", err.message);
//     res.status(500).send("Something went wrong");
//   }
// });

// // UPDATE Profile
// userRouter.put("/user/profile/:userId", async (req, res) => {
//   try {
//     const updated = await User.findByIdAndUpdate(req.params.userId, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updated) return res.status(404).send("User not found.");
//     res.json(updated);
//   } catch (err) {
//     if (isInvalidObjectId(err)) return res.status(400).send("Invalid user ID format");
//     console.error("❌ Update error:", err.message);
//     res.status(500).send("Something went wrong");
//   }
// });

// // DELETE Profile
// userRouter.delete("/user/profile/:userId", async (req, res) => {
//   try {
//     const deleted = await User.findByIdAndDelete(req.params.userId);
//     if (!deleted) return res.status(404).send("User not found.");
//     res.json({ message: "User deleted" });
//   } catch (err) {
//     if (isInvalidObjectId(err)) return res.status(400).send("Invalid user ID format");
//     console.error("❌ Delete error:", err.message);
//     res.status(500).send("Something went wrong");
//   }
// });

// export default userRouter;

import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/userSchema.js';
import auth from '../middleware/auth.js';

const userRouter = Router();
const isInvalidObjectId = (err) => err instanceof mongoose.Error.CastError;

// — USER Sign-In —
userRouter.post('/user/sign-in', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found.');
    if (user.role !== 'user') return res.status(403).send('Only users can log in here.');

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).send('Invalid email or password.');

    return res.send(user.generateJWTToken());
  } catch (err) {
    console.error('❌ Sign-in error:', err.message);
    res.status(500).send('Unknown error occurred.');
  }
});

// — ADMIN Sign-In —
userRouter.post('/admin/sign-in', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email });
    if (!admin) return res.status(404).send('Admin not found.');
    if (admin.role !== 'admin') return res.status(403).send('Only admins can log in here.');

    const match = await admin.comparePassword(password);
    if (!match) return res.status(400).send('Invalid email or password.');

    return res.send(admin.generateJWTToken());
  } catch (err) {
    console.error('❌ Admin sign-in error:', err.message);
    res.status(500).send('Unknown error occurred.');
  }
});

// — USER Sign-Up —
userRouter.post('/user/sign-up', async (req, res) => {
  try {
    const { email, password, confirmPassword, username, phoneNo, dob, role } = req.body;
    if (!email || !password || !confirmPassword || !username || !phoneNo || !dob) {
      return res.status(400).send('All fields are required.');
    }
    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match.');
    }
    if (await User.exists({ username })) {
      return res.status(409).send('Username already taken');
    }
    if (await User.exists({ email })) {
      return res.status(409).send('Email already registered');
    }

    const newUser = await User.create({
      username,
      email,
      password,
      phoneNo,
      dob,
      role: role === 'admin' ? 'admin' : 'user',
    });

    return res.status(201).send(newUser.generateJWTToken());
  } catch (err) {
    console.error('❌ Signup error:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).send(`${field} already taken`);
    }
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// — GET Profile —
userRouter.get('/user/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, '-password');
    if (!user) return res.status(404).send('User not found.');
    res.json(user);
  } catch (err) {
    if (isInvalidObjectId(err)) return res.status(400).send('Invalid user ID format');
    console.error('❌ Fetch profile error:', err.message);
    res.status(500).send('Something went wrong');
  }
});

// — UPDATE Profile —
userRouter.put('/user/profile/:userId', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).send('User not found.');
    res.json(updated);
  } catch (err) {
    if (isInvalidObjectId(err)) return res.status(400).send('Invalid user ID format');
    console.error('❌ Update error:', err.message);
    res.status(500).send('Something went wrong');
  }
});

// — DELETE Profile —
userRouter.delete('/user/profile/:userId', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.userId);
    if (!deleted) return res.status(404).send('User not found.');
    res.json({ message: 'User deleted' });
  } catch (err) {
    if (isInvalidObjectId(err)) return res.status(400).send('Invalid user ID format');
    console.error('❌ Delete error:', err.message);
    res.status(500).send('Something went wrong');
  }
});

// — RESET PASSWORD —
userRouter.post(
  '/user/reset-password',
  auth, 
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).send('Both currentPassword and newPassword are required.');
      }

      const user = await User.findById(req.userId);
      if (!user) return res.status(404).send('User not found.');

      const match = await user.comparePassword(currentPassword);
      if (!match) return res.status(400).send('Current password is incorrect.');

      user.password = newPassword;
      await user.save();

      res.status(200).send('Password updated successfully.');
    } catch (err) {
      if (isInvalidObjectId(err)) return res.status(400).send('Invalid user ID format');
      console.error('❌ Reset-password error:', err);
      res.status(500).send('Something went wrong.');
    }
  }
);

export default userRouter;