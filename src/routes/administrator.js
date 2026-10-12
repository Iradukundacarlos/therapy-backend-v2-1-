// ============================================
// ADMINISTRATOR ROUTES
// ============================================
import express from "express";
import { getAllAdministrators } from "../controllers/administrator.js";
import { Protect, AllowedRoles } from "../middleware/auth.js";

const AdministratorRoutes = express.Router();

// GET /api/getAllAdministrators (admin)
AdministratorRoutes.get("/api/getAllAdministrators", Protect, AllowedRoles("admin"), getAllAdministrators);

export default AdministratorRoutes;
