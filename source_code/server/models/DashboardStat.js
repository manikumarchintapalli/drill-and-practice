// import mongoose from "mongoose";

// const dashboardStatSchema = new mongoose.Schema({
//   topic: { type: String, required: true, unique: true },
//   attempted: { type: Number, default: 0 },
//   correct: { type: Number, default: 0 },
// });

// const DashboardStat = mongoose.model("DashboardStat", dashboardStatSchema);
// export default DashboardStat;

// models/DashboardStat.js
import mongoose from "mongoose";

const dashboardStatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",        // adjust if your User model is named differently
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  attempted: {
    type: Number,
    default: 0
  },
  correct: {
    type: Number,
    default: 0
  }
});

// ensure one stat doc per user+topic
dashboardStatSchema.index({ user: 1, topic: 1 }, { unique: true });

const DashboardStat = mongoose.model("DashboardStat", dashboardStatSchema);
export default DashboardStat;