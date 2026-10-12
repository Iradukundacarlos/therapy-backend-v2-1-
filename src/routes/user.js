// ============================================
// USER ROUTES
// ============================================
// Reading order of a route:   method + URL, middleware(s), controller
// Protect runs first (is the token valid?), then AllowedRoles (is the role allowed?),
// then the controller does the work.

import express from "express";
import {
    getAllUsers,
    SingleUser,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser
} from "../controllers/user.js";
import { Protect, AllowedRoles } from "../middleware/auth.js";

const UserRoutes = express.Router();

// GET /api/getAllUsers: all users (admin only)
UserRoutes.get("/api/getAllUsers", Protect, AllowedRoles("admin"), getAllUsers);

// GET /api/getUser/:id: one user (":id" is stored in req.params.id)
UserRoutes.get("/api/getUser/:id", Protect, SingleUser);

// POST /api/createUser: create any user, including an admin (admin only)
UserRoutes.post("/api/createUser", Protect, AllowedRoles("admin"), createUser);

// PUT /api/updateUser/:id: update name / phone / password
UserRoutes.put("/api/updateUser/:id", Protect, updateUser);

// PUT /api/updateUserStatus/:id: active / suspended / banned (admin only)
UserRoutes.put("/api/updateUserStatus/:id", Protect, AllowedRoles("admin"), updateUserStatus);

// DELETE /api/deleteUser/:id: delete a user (admin only)
UserRoutes.delete("/api/deleteUser/:id", Protect, AllowedRoles("admin"), deleteUser);

export default UserRoutes;
