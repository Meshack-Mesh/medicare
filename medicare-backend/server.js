import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import patientRoutes from "./routes/patientRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Middleware (Add allowed frontend origins)
app.use(cors({
  origin: [
    "http://localhost:5173", // local dev
    "https://medicare-e91ar6j53-meshack-meshs-projects.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use("/api/patients", patientRoutes);
app.use("/api/auth", authRoutes);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection failed:", err));
