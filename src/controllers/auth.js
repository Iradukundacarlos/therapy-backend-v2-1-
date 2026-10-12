// ============================================
// AUTH CONTROLLER: register & login
// ============================================
// Controllers hold the LOGIC that runs when a URL is called.
// Routes only say "this URL -> this function". The work happens here.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// JWT (JSON Web Token) = a signed "ticket" the server gives after login.
// The client sends it with every later request to prove who they are.
import User from "../database/models/user.js";
import { createUserWithProfile } from "../utils/createUserWithProfile.js";
import { handleError } from "../utils/handleError.js";

// ============================================
// REGISTER a new user (role: "client" or "therapist")
// ============================================
export const Register = async (req, res) => {
    try {
        const { first_name, last_name, email, password, role } = req.body;

        if (!first_name || !last_name || !email || !password || !role)
            return res.status(400).json({ message: "first_name, last_name, email, password and role are required" });

        // Nobody can register themselves as admin.
        if (!["client", "therapist"].includes(role))
            return res.status(400).json({ message: 'role must be "client" or "therapist"' });

        // Is this email already taken?
        const existing = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existing) return res.status(409).json({ message: "this email already exists" });

        // Hash the password for safe storage
        const hashpassword = await bcrypt.hash(password, 10);

        // Creates the user AND the client/therapist profile together (one transaction)
        const user = await createUserWithProfile(req.body, hashpassword);

        // Never send the password hash back
        const { password: removed, ...userData } = user.toJSON();
        res.status(201).json({ message: "user account created successfully", user: userData });
    } catch (error) {
        handleError(res, error);
    }
};

// ============================================
// LOGIN
// ============================================
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "email and password are required" });

        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user)
            return res.status(404).json({ message: "your credentials is no longer in database" });

        // bcrypt.compare() checks the typed password against the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "invalid email or password" });

        if (user.status !== "active")
            return res.status(403).json({ message: `your account is ${user.status}` });

        // Make the token. jwt.sign({ data }, secret, { options })
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            },
            process.env.JWT_SECRET, // the secret from .env keeps tokens safe
            { expiresIn: "2d" }     // after 2 days the user must login again
        );

        res.status(200).json({
            message: "Login successfully",
            token,
            user: { user_id: user.user_id, role: user.role, first_name: user.first_name, last_name: user.last_name, email: user.email }
        });
    } catch (error) {
        handleError(res, error);
    }
};

// ============================================
// ME: who am I? (uses the token)
// ============================================
export const Me = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user_id, { attributes: { exclude: ["password"] } });
        if (!user) return res.status(404).json({ message: "user not found" });
        res.status(200).json(user);
    } catch (error) {
        handleError(res, error);
    }
};
