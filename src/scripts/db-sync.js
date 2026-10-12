// ============================================
// DATABASE SYNC SCRIPT: run with  npm run db-sync
// ============================================
// 1) connects to the database
// 2) creates every table (migrations)
// 3) fills the tables with sample data (seeds)
// It runs once and exits. It is NOT part of the server.

import sequelize from "../config/db.js";
import "../database/index.js"; // load the models first

import { createUserTable } from "../database/migrations/user.js";
import { createTherapistTable } from "../database/migrations/therapist.js";
import { createClientTable } from "../database/migrations/client.js";
import { createAdministratorTable } from "../database/migrations/administrator.js";
import { createAvailabilityTable } from "../database/migrations/availability.js";
import { createAppointmentTable } from "../database/migrations/appointment.js";
import { createTherapySessionTable } from "../database/migrations/therapySession.js";
import { createSessionNoteTable } from "../database/migrations/sessionNote.js";
import { createFeedbackTable } from "../database/migrations/feedback.js";
import { createAssessmentTable } from "../database/migrations/assessment.js";
import { createMessageTable } from "../database/migrations/message.js";
import { createNotificationTable } from "../database/migrations/notification.js";
import { createReportTable } from "../database/migrations/report.js";

import { runAllSeeds } from "../database/seeds/index.js";

const syncDatabase = async () => {
    try {
        console.log("starting database sync...");
        // Step 1: test the connection
        await sequelize.authenticate();
        console.log("Database connection established successfully");

        // Step 2: create the tables.
        // ORDER MATTERS: a table that points to another table (foreign key)
        // must be created AFTER the table it points to.
        await createUserTable();
        await createTherapistTable();
        await createClientTable();
        await createAdministratorTable();
        await createAvailabilityTable();
        await createAppointmentTable();
        await createTherapySessionTable();
        await createSessionNoteTable();
        await createFeedbackTable();
        await createAssessmentTable();
        await createMessageTable();
        await createNotificationTable();
        await createReportTable();

        // Step 3: make sure nothing is missing
        await sequelize.sync({ logging: false });

        // Step 4: insert the sample data
        await runAllSeeds();

        console.log("database synced successfully");
        process.exit(0); // 0 = success
    } catch (error) {
        console.error("Database sync failed:", error);
        process.exit(1); // 1 = error
    }
};

syncDatabase();
