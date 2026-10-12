// ============================================
// THERAPIST CONTROLLER
// ============================================
import { QueryTypes } from "sequelize";
import sequelize from "../config/db.js";
import Therapist from "../database/models/therapist.js";
import User from "../database/models/user.js";
import { pick } from "../utils/pick.js";
import { handleError } from "../utils/handleError.js";

// include = a JOIN: also load the user row (name) of each therapist
const withUser = [{ model: User, attributes: ["first_name", "last_name", "email", "phone"] }];

// Average rating per therapist. This uses RAW SQL to show that Sequelize still
// lets you write SQL when that is simpler.
const getAverageRatings = async () => {
    const rows = await sequelize.query(
        `SELECT a.therapist_id, ROUND(AVG(f.rating), 2) AS avg_rating
         FROM feedback f
         JOIN therapy_session s ON s.session_id = f.session_id
         JOIN appointment a ON a.appointment_id = s.appointment_id
         GROUP BY a.therapist_id`,
        { type: QueryTypes.SELECT }
    );
    const ratings = {};
    rows.forEach((row) => {
        ratings[row.therapist_id] = row.avg_rating;
    });
    return ratings;
};

const addRating = (therapist, ratings) => ({
    ...therapist.toJSON(),
    avg_rating: ratings[therapist.therapist_id] ?? null
});

// GET ALL THERAPISTS (clients see only VERIFIED therapists, admins see everyone)
export const getAllTherapists = async (req, res) => {
    try {
        const where = req.user.role === "admin" ? {} : { verification_status: "verified" };
        const therapists = await Therapist.findAll({
            where,
            include: withUser,
            order: [["therapist_id", "ASC"]]
        });
        const ratings = await getAverageRatings();
        res.status(200).json(therapists.map((t) => addRating(t, ratings)));
    } catch (error) {
        handleError(res, error);
    }
};

// GET ONE THERAPIST BY ID
export const SingleTherapist = async (req, res) => {
    try {
        const therapist = await Therapist.findByPk(req.params.id, { include: withUser });
        if (!therapist) return res.status(404).json({ message: "therapist not found" });
        res.status(200).json(addRating(therapist, await getAverageRatings()));
    } catch (error) {
        handleError(res, error);
    }
};

// GET MY PROFILE (the logged-in therapist)
export const getMyTherapistProfile = async (req, res) => {
    try {
        const therapist = await Therapist.findOne({ where: { user_id: req.user.user_id }, include: withUser });
        if (!therapist) return res.status(404).json({ message: "therapist profile not found" });
        res.status(200).json(addRating(therapist, await getAverageRatings()));
    } catch (error) {
        handleError(res, error);
    }
};

// UPDATE MY PROFILE
export const updateMyTherapistProfile = async (req, res) => {
    try {
        const therapist = await Therapist.findOne({ where: { user_id: req.user.user_id } });
        if (!therapist) return res.status(404).json({ message: "therapist profile not found" });

        await therapist.update(
            pick(req.body, ["license_number", "specialization", "qualifications", "experience_years", "bio"])
        );
        res.status(200).json({ message: "profile updated successfully", therapist });
    } catch (error) {
        handleError(res, error);
    }
};

// VERIFY A THERAPIST (admin only): verified / rejected / pending
export const verifyTherapist = async (req, res) => {
    try {
        const { verification_status } = req.body;
        if (!["verified", "rejected", "pending"].includes(verification_status))
            return res.status(400).json({ message: "verification_status must be verified, rejected or pending" });

        const therapist = await Therapist.findByPk(req.params.id);
        if (!therapist) return res.status(404).json({ message: "therapist not found" });

        await therapist.update({ verification_status });
        res.status(200).json({ message: "therapist verification updated", therapist });
    } catch (error) {
        handleError(res, error);
    }
};
