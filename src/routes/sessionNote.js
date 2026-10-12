// ============================================
// SESSION NOTE ROUTES (private: therapist only)
// ============================================
import express from "express";
import {
    addSessionNote,
    getSessionNotes,
    updateSessionNote,
    deleteSessionNote
} from "../controllers/sessionNote.js";
import { Protect, AllowedRoles } from "../middleware/auth.js";

const SessionNoteRoutes = express.Router();

// POST /api/addSessionNote/:sessionId
SessionNoteRoutes.post("/api/addSessionNote/:sessionId", Protect, AllowedRoles("therapist"), addSessionNote);

// GET /api/getSessionNotes/:sessionId
SessionNoteRoutes.get("/api/getSessionNotes/:sessionId", Protect, AllowedRoles("therapist"), getSessionNotes);

// PUT /api/updateSessionNote/:id
SessionNoteRoutes.put("/api/updateSessionNote/:id", Protect, AllowedRoles("therapist"), updateSessionNote);

// DELETE /api/deleteSessionNote/:id
SessionNoteRoutes.delete("/api/deleteSessionNote/:id", Protect, AllowedRoles("therapist"), deleteSessionNote);

export default SessionNoteRoutes;
