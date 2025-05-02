import express from "express";
import jwt from "jsonwebtoken";
import Problem from "../models/Problem.js";
import Topic from "../models/Topic.js";

const questionsRoutes = express.Router();

// —————————————————————————
// Admin check (unchanged)
// —————————————————————————
const verifyAdmin = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return { error: "Access Denied. No token provided.", status: 401 };

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    if (decoded.role !== "admin") {
      return { error: "Access Denied. Admins only.", status: 403 };
    }
    return { user: decoded };
  } catch (err) {
    return { error: "Invalid token", status: 400 };
  }
};

// —————————————————————————
// GET all problems (public), enriched with topic info
// —————————————————————————
questionsRoutes.get("/", async (req, res) => {
  try {
    // 1. Fetch raw problems (topic is still a slug string)
    const problems = await Problem.find().lean();

    // 2. Build a unique list of that slug field
    const slugs = [...new Set(problems.map((p) => p.topic))];

    // 3. Fetch matching topics by slug
    const topics = await Topic.find({ slug: { $in: slugs } }).lean();
    const slugToTopic = Object.fromEntries(
      topics.map((t) => [t.slug, { _id: t._id, name: t.name, slug: t.slug }])
    );

    // 4. Merge the real topic object into each problem
    const enriched = problems.map((p) => ({
      ...p,
      topic: slugToTopic[p.topic] || { name: p.topic, slug: p.topic },
    }));

    res.json(enriched);
  } catch (err) {
    console.error("❌ Failed to fetch problems:", err);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

// —————————————————————————
// Add new problem (admin-only)
// —————————————————————————
questionsRoutes.post("/", async (req, res) => {
  const auth = verifyAdmin(req, res);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });

  try {
    const { topic, title, description, options, answerIndex, difficulty } = req.body;
    const problem = new Problem({ topic, title, description, options, answerIndex, difficulty });
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    console.error("❌ Failed to create problem:", err);
    res.status(500).json({ error: "Failed to create problem" });
  }
});

// —————————————————————————
// Update problem (admin-only)
// —————————————————————————
questionsRoutes.put("/:id", async (req, res) => {
  const auth = verifyAdmin(req, res);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });

  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("❌ Failed to update problem:", err);
    res.status(500).json({ error: "Failed to update problem" });
  }
});

// —————————————————————————
// Delete problem (admin-only)
// —————————————————————————
questionsRoutes.delete("/:id", async (req, res) => {
  const auth = verifyAdmin(req, res);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });

  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: "Problem deleted" });
  } catch (err) {
    console.error("❌ Failed to delete problem:", err);
    res.status(500).json({ error: "Failed to delete problem" });
  }
});

export default questionsRoutes;