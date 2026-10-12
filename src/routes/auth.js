// ============================================
// AUTH ROUTES: register, login, me
// ============================================
// A ROUTE only connects an HTTP method + URL to a controller function.
// The logic is NOT here: it is in controllers/auth.js.

import express from "express";
import { Register, Login, Me } from "../controllers/auth.js";
import { Protect } from "../middleware/auth.js";

const AuthRoutes = express.Router();

// POST /api/register: create an account (open to everyone)
AuthRoutes.post("/api/register", Register);

// POST /api/login: sign in with email + password, receive a token
AuthRoutes.post("/api/login", Login);

// GET /api/me: who am I? (needs the token)
AuthRoutes.get("/api/me", Protect, Me);

export default AuthRoutes;
