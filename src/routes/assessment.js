// ============================================
// ASSESSMENT ROUTES (client)
// ============================================
import express from "express";
import { createAssessment, getMyAssessments } from "../controllers/assessment.js";
import { Protect, AllowedRoles } from "../middleware/auth.js";

const AssessmentRoutes = express.Router();

// POST /api/createAssessment
AssessmentRoutes.post("/api/createAssessment", Protect, AllowedRoles("client"), createAssessment);

// GET /api/getMyAssessments
AssessmentRoutes.get("/api/getMyAssessments", Protect, AllowedRoles("client"), getMyAssessments);

export default AssessmentRoutes;
