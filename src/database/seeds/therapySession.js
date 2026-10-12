import TherapySession from "../models/therapySession.js";
import Appointment from "../models/appointment.js";
import { daysFromNow, getClientId, getTherapistId } from "./helpers.js";

export const seedTherapySessions = async () => {
    if ((await TherapySession.count()) > 0) {
        console.log("therapy sessions already have data, skipped");
        return;
    }

    const amina = await getTherapistId("amina@therapy.com");
    const eric = await getClientId("eric@therapy.com");
    const aline = await getClientId("aline@therapy.com");

    // find the appointments created by the appointment seed
    const completed = await Appointment.findOne({ where: { client_id: eric, therapist_id: amina } });
    const confirmed = await Appointment.findOne({ where: { client_id: aline, therapist_id: amina } });

    await TherapySession.bulkCreate([
        {
            appointment_id: completed.appointment_id,
            session_type: "video",
            meeting_link: "https://meet.example.com/eric-amina",
            started_at: new Date(`${daysFromNow(-3)}T09:00:00`),
            ended_at: new Date(`${daysFromNow(-3)}T09:55:00`),
            status: "completed"
        },
        {
            appointment_id: confirmed.appointment_id,
            session_type: "video",
            meeting_link: "https://meet.example.com/aline-amina",
            status: "scheduled"
        }
    ]);
    console.log("therapy sessions seeded");
};
