import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { auth } from "./lib/auth.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import memberRoutes from "./routes/members.js";
import resourceRoutes from "./routes/resources.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Better Auth handler (must come before express.json)
app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());

// ─── Database ─────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/club-members")
  .then(() => console.log("MongoDB connected (Mongoose)"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// ─── Routes ───────────────────────────────────────────────
app.use("/api", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

// ─── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
