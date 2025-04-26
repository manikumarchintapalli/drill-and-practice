import userRouter from "./user.js";
import analyzeRoute from "./analyze.js";
import topicRoutes from "./topicRoutes.js";
import questionsRoutes from "./questionRoutes.js";
import courseRoutes from "./courseRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";


const initializeRoutes = (app) => {
  app.use("/api", userRouter);
  app.use("/api/analyze", analyzeRoute);
  app.use("/api/courses", courseRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/problems", questionsRoutes);
  app.use("/api/topics", topicRoutes); // ✅ ADD THIS
};

export default initializeRoutes;