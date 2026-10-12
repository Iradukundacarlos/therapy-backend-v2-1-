// ============================================
// SESSION NOTE CONTROLLER: PRIVATE notes written by the therapist
// ============================================
import SessionNote from "../database/models/sessionNote.js";
import { loadSession } from "../utils/loadSession.js";
import { HttpError, handleError } from "../utils/handleError.js";

// only the therapist of that session may touch its notes
const loadMySession = async (req) => {
    const session = await loadSession(req.params.sessionId);
    if (session.Appointment.Therapist.user_id !== req.user.user_id)
        throw new HttpError(404, "session not found");
    return session;
};

// ADD A NOTE
export const addSessionNote = async (req, res) => {
    try {
        const { note_content } = req.body;
        if (!note_content) return res.status(400).json({ message: "note_content is required" });

        const session = await loadMySession(req);
        const note = await SessionNote.create({
            session_id: session.session_id,
            therapist_id: session.Appointment.therapist_id,
            note_content
        });
        res.status(201).json({ message: "note added successfully", note });
    } catch (error) {
        handleError(res, error);
    }
};

// LIST THE NOTES OF A SESSION
export const getSessionNotes = async (req, res) => {
    try {
        const session = await loadMySession(req);
        const notes = await SessionNote.findAll({
            where: { session_id: session.session_id },
            order: [["created_at", "ASC"]]
        });
        res.status(200).json(notes);
    } catch (error) {
        handleError(res, error);
    }
};

// UPDATE ONE NOTE (the therapist who wrote it)
export const updateSessionNote = async (req, res) => {
    try {
        const { note_content } = req.body;
        if (!note_content) return res.status(400).json({ message: "note_content is required" });

        const note = await SessionNote.findByPk(req.params.id);
        if (!note) return res.status(404).json({ message: "note not found" });

        const session = await loadSession(note.session_id);
        if (session.Appointment.Therapist.user_id !== req.user.user_id)
            return res.status(404).json({ message: "note not found" });

        await note.update({ note_content });
        res.status(200).json({ message: "note updated successfully", note });
    } catch (error) {
        handleError(res, error);
    }
};

// DELETE ONE NOTE (the therapist who wrote it)
export const deleteSessionNote = async (req, res) => {
    try {
        const note = await SessionNote.findByPk(req.params.id);
        if (!note) return res.status(404).json({ message: "note not found" });

        const session = await loadSession(note.session_id);
        if (session.Appointment.Therapist.user_id !== req.user.user_id)
            return res.status(404).json({ message: "note not found" });

        await note.destroy();
        res.status(200).json({ message: "note deleted successfully" });
    } catch (error) {
        handleError(res, error);
    }
};
