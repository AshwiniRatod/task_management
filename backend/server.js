import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ---------- CORS CONFIGURATION ----------
app.use(cors({
  origin: ["http://localhost:3000", "https://task-manager-git-main-ashuratod40-gmailcoms-projects.vercel.app"], // replace with your Vercel frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // if you are using cookies/auth
}));
// ----------------------------------------

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
