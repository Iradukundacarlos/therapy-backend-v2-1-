import SessionNote from "../models/sessionNote.js";
import TherapySession from "../models/therapySession.js";
import Appointment from "../models/appointment.js";
import { getClientId, getTherapistId } from "./helpers.js";

export const seedSessionNotes = async () => {
    if ((await SessionNote.count()) > 0) {
        console.log("session notes already have data, skipped");
        return;
    }

    const amina = await getTherapistId("amina@therapy.com");
    const eric = await getClientId("eric@therapy.com");

    // the completed session of Eric with Amina
    const appointment = await Appointment.findOne({ where: { client_id: eric, therapist_id: amina } });
    const session = await TherapySession.findOne({ where: { appointment_id: appointment.appointment_id } });

    await SessionNote.bulkCreate([
        { session_id: session.session_id, therapist_id: amina, note_content: "Client reports poor sleep and constant worry about work." },
        { session_id: session.session_id, therapist_id: amina, note_content: "Introduced breathing exercises. Homework: sleep diary for one week." }
    ]);
    console.log("session notes seeded");
};
