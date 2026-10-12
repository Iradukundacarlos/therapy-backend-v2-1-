// ============================================
// USER CONTROLLER: manage users
// ============================================
import bcrypt from "bcryptjs";
import User from "../database/models/user.js";
import { createUserWithProfile } from "../utils/createUserWithProfile.js";
import { pick } from "../utils/pick.js";
import { handleError } from "../utils/handleError.js";

// async/await: "await" pauses the function until the database answers.
// req = the request (body, params, logged-in user).  res = what we send back.

// ============================================
// GET ALL USERS (admin only: see the route)
// ============================================
export const getAllUsers = async (req, res) => {
    try {
        // findAll() = SELECT * FROM users.  We hide the password column.
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            order: [["user_id", "ASC"]]
        });
        res.status(200).json(users);
    } catch (error) {
        handleError(res, error);
    }
};

// ============================================
// GET SINGLE USER BY ID (the user himself, or an admin)
// ============================================
export const SingleUser = async (req, res) => {
    try {
        // req.params.id reads the :id from the URL, e.g. /api/getUser/3
        // findByPk() = "find by primary key"
        if (req.user.role !== "admin" && String(req.user.user_id) !== req.params.id)
            return res.status(403).json({ message: "access denied" });

        const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password"] } });
        if (!user) return res.status(404).json({ message: "user not found" });
        res.status(200).json(user);
    } catch (error) {
        handleError(res, error);
    }
};

// ============================================
// CREATE USER (admin only: can create any role, including admin)
// ============================================
export const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, role } = req.body;
        if (!first_name || !last_name || !email || !password || !role)
            return res.status(400).json({ message: "first_name, last_name, email, password and role are required" });
        if (!["client", "therapist", "admin"].includes(role))
            return res.status(400).json({ message: "role must be client, therapist or admin" });

        const existing = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existing) return res.status(409).json({ message: "this email already exists" });

        const hashpassword = await bcrypt.hash(password, 10);
        const user = await createUserWithProfile(req.body, hashpassword);

        const { password: removed, ...userData } = user.toJSON();
        res.status(201).json({ message: "user created successfully", user: userData });
    } catch (error) {
        handleError(res, error);
    }
};

// ============================================
// UPDATE USER (the user himself, or an admin)
// ============================================
export const updateUser = async (req, res) => {
    try {
        if (req.user.role !== "admin" && String(req.user.user_id) !== req.params.id)
            return res.status(403).json({ message: "access denied" });

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "user not found" });

        // Only these fields may be changed here (so nobody can change their own role).
        const changes = pick(req.body, ["first_name", "last_name", "phone"]);

        // A new password must be hashed too
        if (req.body.password) changes.password = await bcrypt.hash(req.body.password, 10);

        await user.update(changes);

        const { password: removed, ...userData } = user.toJSON();
        res.status(200).json({ message: "user updated successfully", user: userData });
    } catch (error) {
        handleError(res, error);
    }
};

// ============================================
// UPDATE USER STATUS (admin only): active / suspended / banned
// ============================================
export const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["active", "suspended", "banned"].includes(status))
            return res.status(400).json({ message: "status must be active, suspended or banned" });

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "user not found" });

        await user.update({ status });
        res.status(200).json({
            message: "user status updated",
            user: { user_id: user.user_id, email: user.email, role: user.role, status: user.status }
        });
    } catch (error) {
        handleError(res, error);
    }
};

// ============================================
// DELETE USER (admin only)
// ============================================
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "user not found" });

        await user.destroy(); // DELETE FROM users WHERE ...
        res.status(200).json({ message: "user deleted successfully" });
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError")
            return res.status(409).json({ message: "this user has appointments, messages or other data. Suspend the user instead of deleting." });
        handleError(res, error);
    }
};
