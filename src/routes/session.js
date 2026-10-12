// ============================================
// THERAPY SESSION ROUTES
// ============================================
import express from "express";
import { createSession, SingleSession, startSession, endSession } from "../controllers/session.js";
import { Protect, AllowedRoles } from "../middleware/auth.js";

const SessionRoutes = express.Router();

// POST /api/createSession (therapist)
SessionRoutes.post("/api/createSession", Protect, AllowedRoles("therapist"), createSession);

// GET /api/getSession/:id
SessionRoutes.get("/api/getSession/:id", Protect, SingleSession);

// PUT /api/startSession/:id (therapist)
SessionRoutes.put("/api/startSession/:id", Protect, AllowedRoles("therapist"), startSession);

// PUT /api/endSession/:id (therapist)
SessionRoutes.put("/api/endSession/:id", Protect, AllowedRoles("therapist"), endSession);

export default SessionRoutes;
