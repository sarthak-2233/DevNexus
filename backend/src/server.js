import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import websiteRoutes from "./routes/websiteRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ---------- Health Check ----------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DevNexus AI backend is running!",
  });
});

// ---------- Routes ----------
app.use("/api/websites", websiteRoutes);

// ---------- 404 Handler ----------
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error("💥 Server error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
  console.log(`   Health check:  GET  http://localhost:${PORT}/api/health`);
  console.log(`   Analyze site:  POST http://localhost:${PORT}/api/websites/analyze`);
});