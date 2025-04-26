import express from "express";
import Topic from "../models/Topic.js";
import slugify from "slugify";

const topicRoutes = express.Router();

// GET all topics (optional filter by course)
topicRoutes.get("/", async (req, res) => {
  const { courseId } = req.query;
  try {
    const filter = courseId ? { course: courseId } : {};
    const topics = await Topic.find(filter).populate("course");
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

// POST new topic
topicRoutes.post("/", async (req, res) => {
  try {
    const { name, course } = req.body;

    if (!name || !course) {
      return res.status(400).json({ error: "Both name and course are required." });
    }

    const slug = slugify(name, { lower: true });

    // Check for duplicates by slug + course
    const existing = await Topic.findOne({ slug, course });
    if (existing) {
      return res.status(409).json({ error: "Topic already exists in this course." });
    }

    const topic = new Topic({ name, slug, course });
    await topic.save();

    res.status(201).json(topic);
  } catch (err) {
    console.error("❌ Failed to create topic:", err.message);
    res.status(500).json({ error: "Failed to create topic", details: err.message });
  }
});

export default topicRoutes;