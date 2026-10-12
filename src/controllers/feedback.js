// ============================================
// FEEDBACK CONTROLLER: a client rates a session (1 to 5)
// ============================================
import Feedback from "../database/models/feedback.js";
import TherapySession from "../database/models/therapySession.js";
import Appointment from "../database/models/appointment.js";
import { loadSession } from "../utils/loadSession.js";
import { handleError } from "../utils/handleError.js";

// ADD FEEDBACK (the client of that session, once per session)
export const addFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (!rating) return res.status(400).json({ message: "rating (1 to 5) is required" });

        const session = await loadSession(req.params.sessionId);
        if (session.Appointment.Client.user_id !== req.user.user_id)
            return res.status(404).json({ message: "session not found" });

        const already = await Feedback.findOne({
            where: { session_id: session.session_id, client_id: session.Appointment.client_id }
        });
        if (already) return res.status(409).json({ message: "you already gave feedback for this session" });

        const feedback = await Feedback.create({
            session_id: session.session_id,
            client_id: session.Appointment.client_id,
            rating,
            comment
        });
        res.status(201).json({ message: "feedback added successfully", feedback });
    } catch (error) {
        handleError(res, error);
    }
};

// FEEDBACK OF ONE SESSION (its client, its therapist, or an admin)
export const getSessionFeedback = async (req, res) => {
    try {
        const session = await loadSession(req.params.sessionId);
        const { Client, Therapist } = session.Appointment;

        const involved = [Client.user_id, Therapist.user_id].includes(req.user.user_id);
        if (!involved && req.user.role !== "admin") return res.status(403).json({ message: "access denied" });

        const feedback = await Feedback.findAll({ where: { session_id: session.session_id } });
        res.status(200).json(feedback);
    } catch (error) {
        handleError(res, error);
    }
};

// ALL FEEDBACK OF ONE THERAPIST + the average rating (anyone logged in)
export const getTherapistFeedback = async (req, res) => {
    try {
        // Feedback -> its session -> its appointment, filtered on the therapist
        const feedback = await Feedback.findAll({
            include: [
                {
                    model: TherapySession,
                    required: true,
                    attributes: ["session_id"],
                    include: [
                        {
                            model: Appointment,
                            required: true,
                            attributes: ["appointment_id"],
                            where: { therapist_id: req.params.therapistId }
                        }
                    ]
                }
            ],
            order: [["created_at", "DESC"]]
        });

        const total = feedback.reduce((sum, item) => sum + item.rating, 0);
        const average = feedback.length ? Math.round((total / feedback.length) * 100) / 100 : null;

        res.status(200).json({ count: feedback.length, average_rating: average, feedback });
    } catch (error) {
        handleError(res, error);
    }
};
