import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user", // <-- normal users by default
  },
});

// To save password in encrypted form before saving to database
UserSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 12);
    return next();
  } catch (error) {
    return next(error);
  }
});

// To generate auth token
UserSchema.methods.generateJWTToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.username,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_PRIVATE_KEY
  );
};

// To validate auth token
// UserSchema.methods.comparePassword = function (password) {
//   return bcrypt.compareSync(password, this.password);
// };
UserSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password); // ✅ async
};

const User = mongoose.model("User", UserSchema);

export default User;
