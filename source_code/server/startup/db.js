

// import mongoose from "mongoose";

// const initializeDB = async () => {
//   const DB_URI = process.env.NODE_ENV === "test"
//     ? process.env.MONGO_URI_TEST
//     : process.env.DATABASE_URI;

//   if (!DB_URI) {
//     console.error("Database URI not provided in environment variables.");
//     process.exit(1);
//   }

//   try {
//     await mongoose.connect(DB_URI, {
//       // useNewUrlParser: true,
//       // useUnifiedTopology: true,
//     });
//     console.log(`MongoDB connected to ${DB_URI}`);
//   } catch (err) {
//     console.error("MongoDB connection failed:", err.message);
//     process.exit(1);
//   }
// };

// export default initializeDB;

// src/startup/db.js
import mongoose from "mongoose";
import { NODE_ENV, DATABASE_URI, MONGO_URI_TEST } from "../config.js";

const initializeDB = async () => {
  const uri = NODE_ENV === "test" ? MONGO_URI_TEST : DATABASE_URI;

  if (!uri) {
    console.error("Database URI not provided in configuration.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected to ${uri}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default initializeDB;