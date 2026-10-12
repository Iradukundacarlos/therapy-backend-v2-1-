// ============================================
// FEEDBACK ROUTES
// ============================================
import express from "express";
import { addFeedback, getSessionFeedback, getTherapistFeedback } from "../controllers/feedback.js";
import { Protect, AllowedRoles } from "../middleware/auth.js";

const FeedbackRoutes = express.Router();

// POST /api/addFeedback/:sessionId (client)
FeedbackRoutes.post("/api/addFeedback/:sessionId", Protect, AllowedRoles("client"), addFeedback);

// GET /api/getSessionFeedback/:sessionId
FeedbackRoutes.get("/api/getSessionFeedback/:sessionId", Protect, getSessionFeedback);

// GET /api/getTherapistFeedback/:therapistId: all feedback + average rating
FeedbackRoutes.get("/api/getTherapistFeedback/:therapistId", Protect, getTherapistFeedback);

export default FeedbackRoutes;
