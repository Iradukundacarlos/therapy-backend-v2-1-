// ============================================
// RUN ALL SEEDS IN THE RIGHT ORDER
// ============================================
// ORDER MATTERS (same reason as for the tables): a row that points to another
// row needs that other row to exist first.
//   users -> profiles -> availability -> appointments -> sessions -> notes/feedback -> the rest

import { seedUsers } from "./user.js";
import { seedAdministrators } from "./administrator.js";
import { seedTherapists } from "./therapist.js";
import { seedClients } from "./client.js";
import { seedAvailability } from "./availability.js";
import { seedAppointments } from "./appointment.js";
import { seedTherapySessions } from "./therapySession.js";
import { seedSessionNotes } from "./sessionNote.js";
import { seedFeedback } from "./feedback.js";
import { seedAssessments } from "./assessment.js";
import { seedMessages } from "./message.js";
import { seedNotifications } from "./notification.js";
import { seedReports } from "./report.js";

export const runAllSeeds = async () => {
    await seedUsers();
    await seedAdministrators();
    await seedTherapists();
    await seedClients();
    await seedAvailability();
    await seedAppointments();
    await seedTherapySessions();
    await seedSessionNotes();
    await seedFeedback();
    await seedAssessments();
    await seedMessages();
    await seedNotifications();
    await seedReports();

    console.log("");
    console.log("TEST LOGINS (all passwords are  Test123)");
    console.log("  admin     admin@therapy.com");
    console.log("  therapist amina@therapy.com  (verified)");
    console.log("  therapist jean@therapy.com   (verified)");
    console.log("  therapist grace@therapy.com  (pending verification)");
    console.log("  client    eric@therapy.com / aline@therapy.com / patrick@therapy.com / diane@therapy.com");
};
