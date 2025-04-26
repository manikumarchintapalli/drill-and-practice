import mongoose from "mongoose";

const dashboardStatSchema = new mongoose.Schema({
  topic: { type: String, required: true, unique: true },
  attempted: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
});

const DashboardStat = mongoose.model("DashboardStat", dashboardStatSchema);
export default DashboardStat;