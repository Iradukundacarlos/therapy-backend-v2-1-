// ============================================
// NOTIFICATION ROUTES
// ============================================
import express from "express";
import {
    getMyNotifications,
    markNotificationRead,
    markAllNotificationsRead
} from "../controllers/notification.js";
import { Protect } from "../middleware/auth.js";

const NotificationRoutes = express.Router();

// GET /api/getMyNotifications
NotificationRoutes.get("/api/getMyNotifications", Protect, getMyNotifications);

// PUT /api/markAllNotificationsRead   (written BEFORE the ":id" route on purpose)
NotificationRoutes.put("/api/markAllNotificationsRead", Protect, markAllNotificationsRead);

// PUT /api/markNotificationRead/:id
NotificationRoutes.put("/api/markNotificationRead/:id", Protect, markNotificationRead);

export default NotificationRoutes;
