import Appointment from "../models/appointment.js";
import Availability from "../models/availability.js";
import { daysFromNow, getClientId, getTherapistId } from "./helpers.js";

// find a slot by therapist + date + start time
const findSlot = async (therapistId, date, startTime) => {
    const slot = await Availability.findOne({
        where: { therapist_id: therapistId, available_date: date, start_time: startTime }
    });
    if (!slot) throw new Error(`Seed problem: slot ${date} ${startTime} not found. Seed availability first.`);
    return slot;
};

export const seedAppointments = async () => {
    if ((await Appointment.count()) > 0) {
        console.log("appointments already have data, skipped");
        return;
    }

    const amina = await getTherapistId("amina@therapy.com");
    const jean = await getTherapistId("jean@therapy.com");
    const eric = await getClientId("eric@therapy.com");
    const aline = await getClientId("aline@therapy.com");
    const patrick = await getClientId("patrick@therapy.com");
    const diane = await getClientId("diane@therapy.com");

    const slotA = await findSlot(amina, daysFromNow(-3), "09:00");
    const slotB = await findSlot(amina, daysFromNow(1), "10:00");
    const slotC = await findSlot(jean, daysFromNow(2), "10:00");
    const slotD = await findSlot(jean, daysFromNow(3), "14:00");

    // one appointment for each status: completed, confirmed, scheduled, cancelled
    const make = (clientId, therapistId, slot, status, reason) => ({
        client_id: clientId,
        therapist_id: therapistId,
        availability_id: slot.availability_id,
        appointment_date: slot.available_date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        status,
        reason
    });

    await Appointment.bulkCreate([
        make(eric, amina, slotA, "completed", "Anxiety and trouble sleeping"),
        make(aline, amina, slotB, "confirmed", "Stress at work"),
        make(patrick, jean, slotC, "scheduled", "Relationship difficulties"),
        make(diane, jean, slotD, "cancelled", "Feeling low lately") // its slot stays "open"
    ]);
    console.log("appointments seeded");
};
