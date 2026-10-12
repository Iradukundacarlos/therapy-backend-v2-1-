// ============================================
// APPOINTMENT ROUTES
// ============================================
import express from "express";
import {
    bookAppointment,
    getMyAppointments,
    SingleAppointment,
    updateAppointmentStatus
} from "../controllers/appointment.js";
import { Protect, AllowedRoles } from "../middleware/auth.js";

const AppointmentRoutes = express.Router();

// POST /api/bookAppointment (client)
AppointmentRoutes.post("/api/bookAppointment", Protect, AllowedRoles("client"), bookAppointment);

// GET /api/getMyAppointments (client / therapist: their own, admin: all)
AppointmentRoutes.get("/api/getMyAppointments", Protect, getMyAppointments);

// GET /api/getAppointment/:id
AppointmentRoutes.get("/api/getAppointment/:id", Protect, SingleAppointment);

// PUT /api/updateAppointmentStatus/:id (client: cancel only, therapist: confirmed / cancelled / completed)
AppointmentRoutes.put("/api/updateAppointmentStatus/:id", Protect, AllowedRoles("client", "therapist"), updateAppointmentStatus);

export default AppointmentRoutes;
