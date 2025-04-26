import request from "supertest";
import app from "../../index.js";
import User from "../../models/userSchema.js";
import DashboardStat from "../../models/DashboardStat.js";

let userToken;

beforeEach(async () => {
  await DashboardStat.deleteMany({});
  await User.deleteMany({});

  const user = await User.create({
    email: "user@test.com",
    password: "User1234",
    username: "TestUser",
    phoneNo: "1234567890",
    dob: "2000-01-01",
    role: "user",
  });

  const loginRes = await request(app).post("/api/user/sign-in").send({
    email: user.email,
    password: "User1234",
  });

  userToken = loginRes.text;
});

describe(" Dashboard Stats Routes", () => {
  const topic = "Variables";

  test("should return 400 for empty topic", async () => {
    const res = await request(app)
      .post("/api/dashboard/update-dashboard")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ topic: "", isCorrect: true });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid topic");
  });

  test("should update stats with a correct answer", async () => {
    const res = await request(app)
      .post("/api/dashboard/update-dashboard")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ topic, isCorrect: true });

    expect(res.status).toBe(200);
    const stat = await DashboardStat.findOne({ topic: topic.toLowerCase() });
    expect(stat.attempted).toBe(1);
    expect(stat.correct).toBe(1);
  });

  test("should update stats with an incorrect answer", async () => {
    await DashboardStat.create({ topic: topic.toLowerCase(), attempted: 1, correct: 1 });

    const res = await request(app)
      .post("/api/dashboard/update-dashboard")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ topic, isCorrect: false });

    expect(res.status).toBe(200);
    const stat = await DashboardStat.findOne({ topic: topic.toLowerCase() });
    expect(stat.attempted).toBe(2);
    expect(stat.correct).toBe(1);
  });

  test("should retrieve dashboard stats", async () => {
    await DashboardStat.create({ topic: topic.toLowerCase(), attempted: 5, correct: 3 });

    const res = await request(app)
      .get("/api/dashboard/dashboard-stats")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body[topic.toLowerCase()]).toEqual({ attempted: 5, correct: 3 });
  });

  test("should reset dashboard stats", async () => {
    await DashboardStat.create({ topic: topic.toLowerCase(), attempted: 2, correct: 2 });

    const res = await request(app)
      .post("/api/dashboard/reset-dashboard")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    const updated = await DashboardStat.findOne({ topic: topic.toLowerCase() });
    expect(updated.attempted).toBe(0);
    expect(updated.correct).toBe(0);
  });

  test("should handle internal error on update-dashboard", async () => {
    const originalFindOne = DashboardStat.findOne;
    DashboardStat.findOne = () => {
      throw new Error("Simulated DB crash");
    };

    const res = await request(app)
      .post("/api/dashboard/update-dashboard")
      .send({ topic: "ErrorTest", isCorrect: true });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to update dashboard");

    DashboardStat.findOne = originalFindOne;
  });

  test("should handle internal error on dashboard-stats", async () => {
    const originalFind = DashboardStat.find;
    DashboardStat.find = () => {
      throw new Error("Simulated fetch crash");
    };

    const res = await request(app).get("/api/dashboard/dashboard-stats");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch dashboard stats");

    DashboardStat.find = originalFind;
  });

  test("should handle internal error on reset-dashboard", async () => {
    const originalFind = DashboardStat.find;
    DashboardStat.find = () => {
      throw new Error("Simulated reset crash");
    };

    const res = await request(app).post("/api/dashboard/reset-dashboard");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to reset dashboard stats");

    DashboardStat.find = originalFind;
  });
});