// ============================================
// AVAILABILITY ROUTES: the time slots of a therapist
// ============================================
import express from "express";
import {
    createAvailability,
    getMyAvailability,
    getTherapistAvailability,
    updateAvailability,
    deleteAvailability
} from "../controllers/availability.js";
import { Protect, AllowedRoles } from "../middleware/auth.js";

const AvailabilityRoutes = express.Router();

// POST /api/createAvailability (therapist)
AvailabilityRoutes.post("/api/createAvailability", Protect, AllowedRoles("therapist"), createAvailability);

// GET /api/getMyAvailability (therapist)
AvailabilityRoutes.get("/api/getMyAvailability", Protect, AllowedRoles("therapist"), getMyAvailability);

// GET /api/getTherapistAvailability/:therapistId: open future slots (any logged-in user)
AvailabilityRoutes.get("/api/getTherapistAvailability/:therapistId", Protect, getTherapistAvailability);

// PUT /api/updateAvailability/:id (therapist)
AvailabilityRoutes.put("/api/updateAvailability/:id", Protect, AllowedRoles("therapist"), updateAvailability);

// DELETE /api/deleteAvailability/:id (therapist)
AvailabilityRoutes.delete("/api/deleteAvailability/:id", Protect, AllowedRoles("therapist"), deleteAvailability);

export default AvailabilityRoutes;
