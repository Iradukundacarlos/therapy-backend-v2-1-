import Availability from "../models/availability.js";
import { daysFromNow, getTherapistId } from "./helpers.js";

export const seedAvailability = async () => {
    // These tables have no unique column, so running the seed twice would copy the rows.
    // Guard: if the table already has data, skip.
    if ((await Availability.count()) > 0) {
        console.log("availability already has data, skipped");
        return;
    }

    const amina = await getTherapistId("amina@therapy.com");
    const jean = await getTherapistId("jean@therapy.com");

    const slots = [
        // Amina (dates are relative to today so the data never gets old)
        { therapist_id: amina, available_date: daysFromNow(-3), start_time: "09:00", end_time: "10:00", status: "booked" },
        { therapist_id: amina, available_date: daysFromNow(1), start_time: "10:00", end_time: "11:00", status: "booked" },
        { therapist_id: amina, available_date: daysFromNow(1), start_time: "14:00", end_time: "15:00", status: "open" },
        { therapist_id: amina, available_date: daysFromNow(2), start_time: "09:00", end_time: "10:00", status: "open" },
        { therapist_id: amina, available_date: daysFromNow(3), start_time: "11:00", end_time: "12:00", status: "open" },
        // Jean
        { therapist_id: jean, available_date: daysFromNow(2), start_time: "10:00", end_time: "11:00", status: "booked" },
        { therapist_id: jean, available_date: daysFromNow(3), start_time: "14:00", end_time: "15:00", status: "open" },
        { therapist_id: jean, available_date: daysFromNow(4), start_time: "09:00", end_time: "10:00", status: "open" },
        { therapist_id: jean, available_date: daysFromNow(5), start_time: "15:00", end_time: "16:00", status: "open" }
    ];
    await Availability.bulkCreate(slots);
    console.log("availability seeded");
};
