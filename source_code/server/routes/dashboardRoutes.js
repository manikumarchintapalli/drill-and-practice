// import express from "express";
// import DashboardStat from "../models/DashboardStat.js";


// const dashboardRoutes = express.Router();

// // ✅ Utility: Normalize topic name
// const normalize = (str) => str.trim().toLowerCase();

// // ✅ POST: Update stats
// dashboardRoutes.post("/update-dashboard", async (req, res) => {
//   const { topic, isCorrect } = req.body;

//   if (typeof topic !== "string" || !topic.trim()) {
//     return res.status(400).json({ error: "Invalid topic" });
//   }

//   const normalizedTopic = normalize(topic);

//   try {
//     const existing = await DashboardStat.findOne({ topic: normalizedTopic });

//     if (existing) {
//       existing.attempted += 1;
//       if (isCorrect) existing.correct += 1;
//       await existing.save();
//     } else {
//       await DashboardStat.create({
//         topic: normalizedTopic,
//         attempted: 1,
//         correct: isCorrect ? 1 : 0,
//       });
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ Failed to update dashboard:", err);
//     res.status(500).json({ error: "Failed to update dashboard" });
//   }
// });

// // ✅ GET: Return stats
// dashboardRoutes.get("/dashboard-stats", async (req, res) => {
//   try {
//     const statsArray = await DashboardStat.find();
//     const stats = {};

//     for (const s of statsArray) {
//       stats[s.topic] = {
//         attempted: s.attempted,
//         correct: s.correct,
//       };
//     }

//     res.json(stats);
//   } catch (err) {
//     console.error("❌ Failed to fetch dashboard stats:", err);
//     res.status(500).json({ error: "Failed to fetch dashboard stats" });
//   }
// });

// // Reset
// dashboardRoutes.post("/reset-dashboard", async (req, res) => {
//   try {
//     const statsArray = await DashboardStat.find();

//     for (const stat of statsArray) {
//       stat.attempted = 0;
//       stat.correct = 0;
//       await stat.save();
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ Failed to reset dashboard stats:", err);
//     res.status(500).json({ error: "Failed to reset dashboard stats" });
//   }
// });

// export default dashboardRoutes;

// routes/dashboardRoutes.js
import express from "express";
import DashboardStat from "../models/DashboardStat.js";
import auth from "../middleware/auth.js";

const dashboardRoutes = express.Router();

// protect all dashboard endpoints
dashboardRoutes.use(auth);

// normalize helper
const normalize = (str) => str.trim().toLowerCase();

// POST /api/dashboard/update-dashboard
dashboardRoutes.post("/update-dashboard", async (req, res) => {
  const userId = req.userId;
  const { topic, isCorrect } = req.body;

  if (typeof topic !== "string" || !topic.trim()) {
    return res.status(400).json({ error: "Invalid topic" });
  }
  const normalizedTopic = normalize(topic);

  try {
    // find or create
    const existing = await DashboardStat.findOne({ user: userId, topic: normalizedTopic });
    if (existing) {
      existing.attempted += 1;
      if (isCorrect) existing.correct += 1;
      await existing.save();
    } else {
      await DashboardStat.create({
        user: userId,
        topic: normalizedTopic,
        attempted: 1,
        correct: isCorrect ? 1 : 0,
      });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to update dashboard:", err);
    res.status(500).json({ error: "Failed to update dashboard" });
  }
});

// GET /api/dashboard/dashboard-stats
dashboardRoutes.get("/dashboard-stats", async (req, res) => {
  try {
    const userId = req.userId;
    const statsArray = await DashboardStat.find({ user: userId });
    const stats = {};
    statsArray.forEach((s) => {
      stats[s.topic] = {
        attempted: s.attempted,
        correct: s.correct,
        // you can also return s.solved if you add that field
      };
    });
    res.json(stats);
  } catch (err) {
    console.error("❌ Failed to fetch dashboard stats:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// POST /api/dashboard/reset-dashboard
dashboardRoutes.post("/reset-dashboard", async (req, res) => {
  try {
    const userId = req.userId;
    await DashboardStat.updateMany(
      { user: userId },
      { attempted: 0, correct: 0 }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to reset dashboard stats:", err);
    res.status(500).json({ error: "Failed to reset dashboard stats" });
  }
});

export default dashboardRoutes;