import Feedback from "../models/feedback.js";
import TherapySession from "../models/therapySession.js";
import Appointment from "../models/appointment.js";
import { getClientId, getTherapistId } from "./helpers.js";

export const seedFeedback = async () => {
    if ((await Feedback.count()) > 0) {
        console.log("feedback already has data, skipped");
        return;
    }

    const amina = await getTherapistId("amina@therapy.com");
    const eric = await getClientId("eric@therapy.com");

    const appointment = await Appointment.findOne({ where: { client_id: eric, therapist_id: amina } });
    const session = await TherapySession.findOne({ where: { appointment_id: appointment.appointment_id } });

    await Feedback.bulkCreate([
        { session_id: session.session_id, client_id: eric, rating: 5, comment: "Very helpful and kind. I slept better this week." }
    ]);
    console.log("feedback seeded");
};
