import Notification from "../models/notification.js";
import { getUserId } from "./helpers.js";

export const seedNotifications = async () => {
    if ((await Notification.count()) > 0) {
        console.log("notifications already have data, skipped");
        return;
    }

    const amina = await getUserId("amina@therapy.com");
    const jean = await getUserId("jean@therapy.com");
    const grace = await getUserId("grace@therapy.com");
    const eric = await getUserId("eric@therapy.com");
    const aline = await getUserId("aline@therapy.com");

    await Notification.bulkCreate([
        { user_id: amina, title: "New appointment request", message: "A client booked a slot with you.", notification_type: "appointment", is_read: true },
        { user_id: amina, title: "New feedback", message: "A client rated your session 5 out of 5.", notification_type: "feedback", is_read: false },
        { user_id: jean, title: "New appointment request", message: "A client booked a slot with you.", notification_type: "appointment", is_read: false },
        { user_id: grace, title: "Verification pending", message: "Your profile is waiting for admin verification.", notification_type: "verification", is_read: false },
        { user_id: eric, title: "Appointment completed", message: "Your session with Dr Amina is complete.", notification_type: "appointment", is_read: true },
        { user_id: aline, title: "Appointment confirmed", message: "Dr Amina confirmed your appointment.", notification_type: "appointment", is_read: false }
    ]);
    console.log("notifications seeded");
};
