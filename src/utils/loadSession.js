import TherapySession from "../database/models/therapySession.js";
import Appointment from "../database/models/appointment.js";
import Client from "../database/models/client.js";
import Therapist from "../database/models/therapist.js";
import { HttpError } from "./handleError.js";

// Loads a session with its appointment, client and therapist, so a controller
// can check "does this session belong to the logged-in user?"
export const loadSession = async (id) => {
    const session = await TherapySession.findByPk(id, {
        include: [{ model: Appointment, include: [Client, Therapist] }]
    });
    if (!session) throw new HttpError(404, "Session not found");
    return session;
};
