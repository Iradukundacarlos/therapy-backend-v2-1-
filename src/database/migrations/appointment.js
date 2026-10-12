// ============================================
// APPOINTMENT TABLE MIGRATION
// ============================================
// A "migration" is a script that creates a database table.
// This one makes sure the "appointment" table exists.

import sequelize from "../../config/db.js";
import Appointment from "../models/appointment.js";

// Async function because database operations take time (they return Promises).
export const createAppointmentTable = async () => {
    // authenticate() checks that the database connection works
    await sequelize.authenticate();
    // sync() creates the table from the model if it does not exist yet.
    // logging: false -> do not print the raw SQL in the console
    await Appointment.sync({ logging: false });
    console.log("appointment table created or already exists");
};
