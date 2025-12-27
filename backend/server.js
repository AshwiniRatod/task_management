import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

/* =========================
   MIDDLEWARES
========================= */

// Parse JSON body
app.use(express.json({ limit: "10mb" }));


// CORS configuration (JWT via Authorization header)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://task-manager-oxhpepiq-ashuratod40-gmailcoms-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   ROUTES
========================= */

// Auth routes
app.use("/api/auth", authRoutes);

// Protected task routes
app.use("/api/tasks", taskRoutes);

// Health check
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
