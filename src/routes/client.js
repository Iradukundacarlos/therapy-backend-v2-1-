// ============================================
// CLIENT ROUTES
// ============================================
import express from "express";
import { getAllClients, getMyClientProfile, updateMyClientProfile } from "../controllers/client.js";
import { Protect, AllowedRoles } from "../middleware/auth.js";

const ClientRoutes = express.Router();

// GET /api/getAllClients (admin)
ClientRoutes.get("/api/getAllClients", Protect, AllowedRoles("admin"), getAllClients);

// GET /api/getMyClientProfile (client)
ClientRoutes.get("/api/getMyClientProfile", Protect, AllowedRoles("client"), getMyClientProfile);

// PUT /api/updateMyClientProfile (client)
ClientRoutes.put("/api/updateMyClientProfile", Protect, AllowedRoles("client"), updateMyClientProfile);

export default ClientRoutes;
