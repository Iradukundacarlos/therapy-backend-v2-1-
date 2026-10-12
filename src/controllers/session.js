// ============================================
// THERAPY SESSION CONTROLLER
// ============================================
import Appointment from "../database/models/appointment.js";
import TherapySession from "../database/models/therapySession.js";
import { getTherapist } from "../utils/profile.js";
import { loadSession } from "../utils/loadSession.js";
import { handleError } from "../utils/handleError.js";

// CREATE A SESSION (therapist) for one of his CONFIRMED appointments
export const createSession = async (req, res) => {
    try {
        const { appointment_id, session_type, meeting_link } = req.body;
        if (!appointment_id) return res.status(400).json({ message: "appointment_id is required" });

        const therapist = await getTherapist(req.user.user_id);
        const appointment = await Appointment.findByPk(appointment_id);

        if (!appointment || !therapist || appointment.therapist_id !== therapist.therapist_id)
            return res.status(404).json({ message: "appointment not found for you" });
        if (appointment.status !== "confirmed")
            return res.status(409).json({ message: "the appointment must be confirmed first" });

        const session = await TherapySession.create({
            appointment_id,
            session_type: session_type || "video",
            meeting_link
        });
        res.status(201).json({ message: "session created successfully", session });
    } catch (error) {
        handleError(res, error);
    }
};

// GET ONE SESSION (its client, its therapist, or an admin)
export const SingleSession = async (req, res) => {
    try {
        const session = await loadSession(req.params.id);
        const { Client, Therapist } = session.Appointment;

        const involved = [Client.user_id, Therapist.user_id].includes(req.user.user_id);
        if (!involved && req.user.role !== "admin") return res.status(403).json({ message: "access denied" });

        res.status(200).json(session);
    } catch (error) {
        handleError(res, error);
    }
};

// START A SESSION (therapist of that session)
export const startSession = async (req, res) => {
    try {
        const session = await loadSession(req.params.id);
        if (session.Appointment.Therapist.user_id !== req.user.user_id)
            return res.status(404).json({ message: "session not found" });

        await session.update({ started_at: new Date(), status: "in_progress" });
        res.status(200).json({ message: "session started", session });
    } catch (error) {
        handleError(res, error);
    }
};

// END A SESSION (also marks the appointment as completed)
export const endSession = async (req, res) => {
    try {
        const session = await loadSession(req.params.id);
        if (session.Appointment.Therapist.user_id !== req.user.user_id)
            return res.status(404).json({ message: "session not found" });

        await session.update({ ended_at: new Date(), status: "completed" });
        await session.Appointment.update({ status: "completed" });
        res.status(200).json({ message: "session ended", session });
    } catch (error) {
        handleError(res, error);
    }
};
