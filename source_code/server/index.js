

import cors from "cors";
import express from "express";
import path from "path";
import initializeDB from "./startup/db.js";
import initializeRoutes from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config(); 
const app = express();
const STATIC_FILES_DIR = path.join(process.cwd(), "public");

app.use(cors({
  origin: 'http://ec2-3-149-242-97.us-east-2.compute.amazonaws.com:5173', // or use a regex or function if needed
  credentials: true
}));
app.use(express.json());
app.use(
  express.static(path.resolve(process.cwd(), "public"), { extensions: ["js"] })
);

// Database
initializeDB();

// Router
initializeRoutes(app);

app.get("*", (req, res) => {
  return res.sendFile(path.join(STATIC_FILES_DIR, "index.html"));
});

// const server = app.listen(PORT, () => console.log("Listening on port", PORT));

export default app;
