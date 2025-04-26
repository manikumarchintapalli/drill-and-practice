import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

beforeAll(async () => {
  if (!process.env.MONGO_URI_TEST) {
    throw new Error("❌ MONGO_URI_TEST not set in .env.test");
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      // Optional Mongoose config
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("✅ Connected to test database");
  }
});

afterEach(async () => {
  // Clean all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  // Drop the test database completely and close the connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log("🧹 Test DB dropped and connection closed");
});