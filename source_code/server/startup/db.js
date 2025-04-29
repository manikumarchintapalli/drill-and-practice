

import mongoose from "mongoose";

const initializeDB = async () => {
  const DB_URI = process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST
    : process.env.DATABASE_URI;

  if (!DB_URI) {
    console.error("Database URI not provided in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(DB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB connected to ${DB_URI}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default initializeDB;