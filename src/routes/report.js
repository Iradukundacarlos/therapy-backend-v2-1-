// ============================================
// REPORT ROUTES
// ============================================
import express from "express";
import { createReport, getAllReports, getMyReports, updateReportStatus } from "../controllers/report.js";
import { Protect, AllowedRoles } from "../middleware/auth.js";

const ReportRoutes = express.Router();

// POST /api/createReport (any logged-in user)
ReportRoutes.post("/api/createReport", Protect, createReport);

// GET /api/getMyReports
ReportRoutes.get("/api/getMyReports", Protect, getMyReports);

// GET /api/getAllReports (admin)
ReportRoutes.get("/api/getAllReports", Protect, AllowedRoles("admin"), getAllReports);

// PUT /api/updateReportStatus/:id (admin)
ReportRoutes.put("/api/updateReportStatus/:id", Protect, AllowedRoles("admin"), updateReportStatus);

export default ReportRoutes;
