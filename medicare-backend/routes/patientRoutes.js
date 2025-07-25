import express from "express";
import { createPatient, getPatients } from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPatient); // only logged-in users can add
router.get("/", protect, getPatients);    // only logged-in users can view

export default router;
