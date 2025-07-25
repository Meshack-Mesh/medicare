import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import patientRoutes from "./routes/patientRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // <-- Include this if you’ve added auth

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/patients", patientRoutes); // For patient operations (create, get)
app.use("/api/auth", authRoutes);        // For login/register routes

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection failed:", err));
