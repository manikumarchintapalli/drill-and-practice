import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // ✅ added
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  });

const Topic = mongoose.model("Topic", topicSchema);
export default Topic;