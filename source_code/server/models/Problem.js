import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic",required: true },
  title: { type: String, required: true },
  description: String,
  options: [String],
  answerIndex: Number,
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },
});

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
