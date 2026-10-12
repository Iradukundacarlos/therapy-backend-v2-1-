// ============================================
// THERAPY_SESSION TABLE MIGRATION
// ============================================
// A "migration" is a script that creates a database table.
// This one makes sure the "therapy_session" table exists.

import sequelize from "../../config/db.js";
import TherapySession from "../models/therapySession.js";

// Async function because database operations take time (they return Promises).
export const createTherapySessionTable = async () => {
    // authenticate() checks that the database connection works
    await sequelize.authenticate();
    // sync() creates the table from the model if it does not exist yet.
    // logging: false -> do not print the raw SQL in the console
    await TherapySession.sync({ logging: false });
    console.log("therapy_session table created or already exists");
};
