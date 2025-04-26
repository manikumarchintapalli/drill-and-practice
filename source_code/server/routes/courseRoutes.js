import express from "express";
import Course from "../models/Course.js";

const courseRoutes = express.Router();

// GET all courses
courseRoutes.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// POST new course
courseRoutes.post("/", async (req, res) => {
  const { name, description } = req.body;
  try {
    const exists = await Course.findOne({ name });
    if (exists) return res.status(409).json({ error: "Course already exists" });

    const course = new Course({ name, description });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to create course" });
  }
});

export default courseRoutes;