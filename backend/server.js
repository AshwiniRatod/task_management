import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

/* =========================
   MIDDLEWARES
========================= */

// Parse JSON
app.use(express.json());

// CORS (ALLOW VERCEL FRONTEND)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://task-manager-oxhpepiq-ashuratod40-gmailcoms-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);   // register, login
app.use("/api/tasks", taskRoutes); // protected routes

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("Backend is running 🚀");
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
