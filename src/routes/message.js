// ============================================
// MESSAGE ROUTES
// ============================================
import express from "express";
import { sendMessage, getInbox, getConversation, markMessageRead } from "../controllers/message.js";
import { Protect } from "../middleware/auth.js";

const MessageRoutes = express.Router();

// POST /api/sendMessage
MessageRoutes.post("/api/sendMessage", Protect, sendMessage);

// GET /api/getInbox
MessageRoutes.get("/api/getInbox", Protect, getInbox);

// GET /api/getConversation/:otherUserId
MessageRoutes.get("/api/getConversation/:otherUserId", Protect, getConversation);

// PUT /api/markMessageRead/:id
MessageRoutes.put("/api/markMessageRead/:id", Protect, markMessageRead);

export default MessageRoutes;
