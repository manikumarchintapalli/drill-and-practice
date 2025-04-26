import dotenv from "dotenv";
dotenv.config(); // ✅ Make sure .env is loaded

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../../../models/userSchema.js"; // make sure the path is correct

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "test_key";

describe("User Model", () => {
  describe("generateJWTToken", () => {
    it("should return a valid JWT containing _id, username, email, and role", () => {
      const payload = {
        _id: new mongoose.Types.ObjectId(),
        username: "TestUser",
        email: "test@example.com",
        role: "admin",
      };

      const user = new User(payload);
      const token = user.generateJWTToken();
      const decoded = jwt.verify(token, JWT_PRIVATE_KEY);

      expect(decoded).toMatchObject({
        _id: user._id.toString(), // JWT stores _id as string
        name: user.username,
        email: user.email,
        role: user.role,
      });
    });
  });

  describe("comparePassword", () => {
    it("should return true for correct password", async () => {
      const plainPassword = "secret123";
      const hashedPassword = await bcrypt.hash(plainPassword, 12);

      const user = new User({
        username: "user1",
        dob: "2000-01-01",
        phoneNo: "1234567890",
        email: "user1@example.com",
        password: hashedPassword,
      });

      const result = await user.comparePassword(plainPassword);
      expect(result).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const plainPassword = "secret123";
      const hashedPassword = await bcrypt.hash(plainPassword, 12);

      const user = new User({
        username: "user2",
        dob: "2000-01-01",
        phoneNo: "9876543210",
        email: "user2@example.com",
        password: hashedPassword,
      });

      const result = await user.comparePassword("wrongpassword");
      expect(result).toBe(false);
    });
  });
});