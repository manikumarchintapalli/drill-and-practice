

import supertest from "supertest";
import app from "../../index.js";
import Problem from "../../models/Problem.js";
import User from "../../models/userSchema.js";

const request = supertest(app);

let adminToken;
let createdProblemId;

const sampleProblem = {
  topic: "Science",
  title: "What is H2O?",
  description: "Basic chemistry question",
  options: ["Water", "Oxygen", "Hydrogen", "Helium"],
  answerIndex: 0,
  difficulty: "Easy",
};

beforeAll(async () => {
  // Create a test admin user
  await User.create({
    email: "admin@test.com",
    password: "Admin1234",
    username: "Admin",
    phoneNo: "1234567890",
    dob: "2000-01-01",
    role: "admin",
  });

  // Login to get admin token
  const loginRes = await request.post("/api/admin/sign-in").send({
    email: "admin@test.com",
    password: "Admin1234",
  });

  adminToken = loginRes.text;
});

afterAll(async () => {
  // Clean up test admin and test-created problems
  await User.deleteOne({ email: "admin@test.com" });
  await Problem.deleteMany({ topic: "Science" });
});

describe("🧠 Admin-Protected Questions / Problems API", () => {
  test("should fail to create a problem without token", async () => {
    const res = await request.post("/api/problems").send(sampleProblem);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Access Denied. No token provided.");
  });

  test("should allow admin to create a new problem", async () => {
    const res = await request
      .post("/api/problems")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(sampleProblem);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe(sampleProblem.title);

    createdProblemId = res.body._id;
  });

  test("should fetch all problems", async () => {
    const res = await request.get("/api/problems");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("should allow admin to update a problem", async () => {
    const createRes = await request
      .post("/api/problems")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(sampleProblem);

    const id = createRes.body._id;

    const res = await request
      .put(`/api/problems/${id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Updated Question Title" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Question Title");
  });

  test("should allow admin to delete a problem", async () => {
    const createRes = await request
      .post("/api/problems")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(sampleProblem);

    const id = createRes.body._id;

    const res = await request
      .delete(`/api/problems/${id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Problem deleted");
  });

  // --------------- Error Handling Tests ----------------

  test("should handle GET /api/problems server error", async () => {
    const original = Problem.find;
    Problem.find = () => { throw new Error("DB crash"); };

    const res = await request.get("/api/problems");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch problems");

    Problem.find = original; // Restore original
  });

  test("should handle POST /api/problems server error", async () => {
    const originalSave = Problem.prototype.save;
    Problem.prototype.save = () => { throw new Error("Save error"); };

    const res = await request
      .post("/api/problems")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(sampleProblem);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to create problem");

    Problem.prototype.save = originalSave; // Restore original
  });

  test("should handle PUT /api/problems/:id server error", async () => {
    const originalUpdate = Problem.findByIdAndUpdate;
    Problem.findByIdAndUpdate = () => { throw new Error("Update fail"); };

    const res = await request
      .put("/api/problems/123")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Fail Update" });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to update problem");

    Problem.findByIdAndUpdate = originalUpdate;
  });

  test("should handle DELETE /api/problems/:id server error", async () => {
    const originalDelete = Problem.findByIdAndDelete;
    Problem.findByIdAndDelete = () => { throw new Error("Delete fail"); };

    const res = await request
      .delete("/api/problems/123")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to delete problem");

    Problem.findByIdAndDelete = originalDelete;
  });

  test("should return 400 for invalid token", async () => {
    const res = await request
      .post("/api/problems")
      .set("Authorization", "Bearer invalidtoken")
      .send(sampleProblem);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });

});