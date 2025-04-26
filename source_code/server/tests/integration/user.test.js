
// // tests/integration/user.test.js
// import supertest from "supertest";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";
// import server from "../../index.js";
// import User from "../../models/userSchema.js";

// const request = supertest(server);
// const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
// const VALID_OBJECT_ID = new mongoose.Types.ObjectId().toHexString();

// const TEST_USER = {
//   email: "user@example.com",
//   password: "userpass",
//   confirmPassword: "userpass",
//   username: "testuser",
//   phoneNo: "1234567890",
//   dob: "1999-01-01",
//   role: "user",
// };

// const TEST_ADMIN = {
//   email: `admin+${Date.now()}@example.com`,
//   password: "adminpass",
//   confirmPassword: "adminpass",
//   username: "adminuser",
//   phoneNo: "9999999999",
//   dob: "1990-01-01",
//   role: "admin",
// };

// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGO_URI_TEST);
// });

// afterEach(async () => {
//   await User.deleteMany({});
// });

// afterAll(async () => {
//   await mongoose.disconnect();
// });

// describe("🧪 User/Auth Routes Coverage", () => {
//   test("❌ Missing fields during registration", async () => {
//     const res = await request.post("/api/user/sign-up").send({});
//     expect(res.status).toBe(400);
//   });

//   test("❌ Password mismatch on sign-up", async () => {
//     const res = await request.post("/api/user/sign-up").send({ ...TEST_USER, confirmPassword: "wrong" });
//     expect(res.status).toBe(400);
//   });

//   test("✅ User sign-up and token return", async () => {
//     const res = await request.post("/api/user/sign-up").send(TEST_USER);
//     expect(res.status).toBe(201);
//     const decoded = jwt.verify(res.text, JWT_PRIVATE_KEY);
//     expect(decoded.email).toBe(TEST_USER.email);
//   });

//   test("❌ Duplicate user registration fails", async () => {
//     await request.post("/api/user/sign-up").send(TEST_USER);
//     const res = await request.post("/api/user/sign-up").send(TEST_USER);
//     expect(res.status).toBe(400);
//   });

//   test("✅ Admin sign-up and login", async () => {
//     await request.post("/api/user/sign-up").send(TEST_ADMIN);
//     const loginRes = await request.post("/api/admin/sign-in").send({
//       email: TEST_ADMIN.email,
//       password: TEST_ADMIN.password,
//     });
//     expect(loginRes.status).toBe(200);
//   });

//   test("❌ Sign in with wrong password", async () => {
//     await request.post("/api/user/sign-up").send(TEST_USER);
//     const res = await request.post("/api/user/sign-in").send({ email: TEST_USER.email, password: "wrong" });
//     expect(res.status).toBe(400);
//   });

//   test("❌ Sign in with non-existent email", async () => {
//     const res = await request.post("/api/user/sign-in").send({ email: "none@abc.com", password: "pass" });
//     expect(res.status).toBe(404);
//   });

//   test("❌ Admin login with user role", async () => {
//     await request.post("/api/user/sign-up").send(TEST_USER);
//     const res = await request.post("/api/admin/sign-in").send({ email: TEST_USER.email, password: TEST_USER.password });
//     expect(res.status).toBe(403);
//   });

//   test("❌ User login with admin role", async () => {
//     await request.post("/api/user/sign-up").send(TEST_ADMIN);
//     const res = await request.post("/api/user/sign-in").send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password });
//     expect(res.status).toBe(403);
//   });

//   test("❌ Invalid profile ID format returns 400", async () => {
//     const res = await request.get("/api/user/profile/invalid-id");
//     expect(res.status).toBe(400);
//   });

//   test("✅ Fetch user profile by ID", async () => {
//     await request.post("/api/user/sign-up").send(TEST_USER);
//     const user = await User.findOne({ email: TEST_USER.email });
//     const res = await request.get(`/api/user/profile/${user._id}`);
//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty("email", TEST_USER.email);
//   });

//   test("✅ PUT update user profile", async () => {
//     await request.post("/api/user/sign-up").send(TEST_USER);
//     const user = await User.findOne({ email: TEST_USER.email });
//     const res = await request.put(`/api/user/profile/${user._id}`).send({ username: "Updated" });
//     expect(res.status).toBe(200);
//     expect(res.body.username).toBe("Updated");
//   });

//   test("❌ PUT update invalid ID format", async () => {
//     const res = await request.put("/api/user/profile/invalid").send({ username: "Test" });
//     expect(res.status).toBe(400);
//   });

//   test("✅ DELETE user profile", async () => {
//     await request.post("/api/user/sign-up").send(TEST_USER);
//     const user = await User.findOne({ email: TEST_USER.email });
//     const res = await request.delete(`/api/user/profile/${user._id}`);
//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe("User deleted");
//   });

//   test("❌ DELETE with invalid ID format", async () => {
//     const res = await request.delete("/api/user/profile/invalid-id");
//     expect(res.status).toBe(400);
//   });

//   test("❌ Simulate fetch profile error", async () => {
//     const original = User.findById;
//     User.findById = () => { throw new Error("Simulated error") };
//     const res = await request.get(`/api/user/profile/${VALID_OBJECT_ID}`);
//     expect(res.status).toBe(500);
//     User.findById = original;
//   });

//   test("❌ Simulate update error", async () => {
//     const original = User.findByIdAndUpdate;
//     User.findByIdAndUpdate = () => { throw new Error("Update crash") };
//     const res = await request.put(`/api/user/profile/${VALID_OBJECT_ID}`).send({ username: "boom" });
//     expect(res.status).toBe(500);
//     User.findByIdAndUpdate = original;
//   });

//   test("❌ Simulate delete error", async () => {
//     const original = User.findByIdAndDelete;
//     User.findByIdAndDelete = () => { throw new Error("Delete fail") };
//     const res = await request.delete(`/api/user/profile/${VALID_OBJECT_ID}`);
//     expect(res.status).toBe(500);
//     User.findByIdAndDelete = original;
//   });

//   test("❌ Simulate internal sign-in error", async () => {
//     const original = User.findOne;
//     User.findOne = () => {
//       throw new Error("Sign-in crash");
//     };
//     const res = await request.post("/api/user/sign-in").send({
//       email: TEST_USER.email,
//       password: TEST_USER.password,
//     });
//     expect(res.status).toBe(500);
//     User.findOne = original;
//   });

//   test("❌ Simulate internal sign-up error", async () => {
//     const original = User.create;
//     User.create = () => {
//       throw new Error("Simulated crash");
//     };
//     const res = await request.post("/api/user/sign-up").send(TEST_USER);
//     expect(res.status).toBe(500);
//     expect(res.body.message).toBe("Internal Server Error");
//     User.create = original;
//   });
// });

// tests/integration/user.test.js
import supertest from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import server from "../../index.js";
import User from "../../models/userSchema.js";

const request = supertest(server);
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const VALID_OBJECT_ID = new mongoose.Types.ObjectId().toHexString();

const TEST_USER = {
  email: "user@example.com",
  password: "userpass",
  confirmPassword: "userpass",
  username: "testuser",
  phoneNo: "1234567890",
  dob: "1999-01-01",
  role: "user",
};

const TEST_ADMIN = {
  email: `admin+${Date.now()}@example.com`,
  password: "adminpass",
  confirmPassword: "adminpass",
  username: "adminuser",
  phoneNo: "9999999999",
  dob: "1990-01-01",
  role: "admin",
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("User/Auth Routes Coverage", () => {
  test("Missing fields during registration", async () => {
    const res = await request.post("/api/user/sign-up").send({});
    expect(res.status).toBe(400);
  });

  test("Password mismatch on sign-up", async () => {
    const res = await request.post("/api/user/sign-up").send({ ...TEST_USER, confirmPassword: "wrong" });
    expect(res.status).toBe(400);
  });

  test("User sign-up and token return", async () => {
    const res = await request.post("/api/user/sign-up").send(TEST_USER);
    expect(res.status).toBe(201);
    const decoded = jwt.verify(res.text, JWT_PRIVATE_KEY);
    expect(decoded.email).toBe(TEST_USER.email);
  });

  test("Duplicate user registration fails", async () => {
    await request.post("/api/user/sign-up").send(TEST_USER);
    const res = await request.post("/api/user/sign-up").send(TEST_USER);
    expect(res.status).toBe(400);
  });

  test("Admin sign-up and login", async () => {
    await request.post("/api/user/sign-up").send(TEST_ADMIN);
    const loginRes = await request.post("/api/admin/sign-in").send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    expect(loginRes.status).toBe(200);
  });

  test("Sign in with wrong password", async () => {
    await request.post("/api/user/sign-up").send(TEST_USER);
    const res = await request.post("/api/user/sign-in").send({ email: TEST_USER.email, password: "wrong" });
    expect(res.status).toBe(400);
  });

  test(" Sign in with non-existent email", async () => {
    const res = await request.post("/api/user/sign-in").send({ email: "none@abc.com", password: "pass" });
    expect(res.status).toBe(404);
  });

  test(" Admin login with user role", async () => {
    await request.post("/api/user/sign-up").send(TEST_USER);
    const res = await request.post("/api/admin/sign-in").send({ email: TEST_USER.email, password: TEST_USER.password });
    expect(res.status).toBe(403);
  });

  test(" User login with admin role", async () => {
    await request.post("/api/user/sign-up").send(TEST_ADMIN);
    const res = await request.post("/api/user/sign-in").send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password });
    expect(res.status).toBe(403);
  });

  test(" Invalid profile ID format returns 400", async () => {
    const res = await request.get("/api/user/profile/invalid-id");
    expect(res.status).toBe(400);
  });

  test(" Fetch user profile by ID", async () => {
    await request.post("/api/user/sign-up").send(TEST_USER);
    const user = await User.findOne({ email: TEST_USER.email });
    const res = await request.get(`/api/user/profile/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", TEST_USER.email);
  });

  test(" PUT update user profile", async () => {
    await request.post("/api/user/sign-up").send(TEST_USER);
    const user = await User.findOne({ email: TEST_USER.email });
    const res = await request.put(`/api/user/profile/${user._id}`).send({ username: "Updated" });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("Updated");
  });

  test(" PUT update invalid ID format", async () => {
    const res = await request.put("/api/user/profile/invalid").send({ username: "Test" });
    expect(res.status).toBe(400);
  });

  test(" DELETE user profile", async () => {
    await request.post("/api/user/sign-up").send(TEST_USER);
    const user = await User.findOne({ email: TEST_USER.email });
    const res = await request.delete(`/api/user/profile/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted");
  });

  test(" DELETE with invalid ID format", async () => {
    const res = await request.delete("/api/user/profile/invalid-id");
    expect(res.status).toBe(400);
  });

  test(" Simulate sign-in internal error", async () => {
    const original = User.findOne;
    User.findOne = () => { throw new Error("Crash") };
    const res = await request.post("/api/user/sign-in").send({ email: TEST_USER.email, password: "x" });
    expect(res.status).toBe(500);
    User.findOne = original;
  });

  test("Simulate sign-up internal error", async () => {
    const original = User.create;
    User.create = () => { throw new Error("Signup Error") };
    const res = await request.post("/api/user/sign-up").send(TEST_USER);
    expect(res.status).toBe(500);
    User.create = original;
  });

  test("Simulate get profile error", async () => {
    const original = User.findById;
    User.findById = () => { throw new Error("Get error") };
    const res = await request.get(`/api/user/profile/${VALID_OBJECT_ID}`);
    expect(res.status).toBe(500);
    User.findById = original;
  });

  test("Simulate update profile error", async () => {
    const original = User.findByIdAndUpdate;
    User.findByIdAndUpdate = () => { throw new Error("Update error") };
    const res = await request.put(`/api/user/profile/${VALID_OBJECT_ID}`).send({ username: "Boom" });
    expect(res.status).toBe(500);
    User.findByIdAndUpdate = original;
  });

  test("Simulate delete profile error", async () => {
    const original = User.findByIdAndDelete;
    User.findByIdAndDelete = () => { throw new Error("Delete fail") };
    const res = await request.delete(`/api/user/profile/${VALID_OBJECT_ID}`);
    expect(res.status).toBe(500);
    User.findByIdAndDelete = original;
  });
});
