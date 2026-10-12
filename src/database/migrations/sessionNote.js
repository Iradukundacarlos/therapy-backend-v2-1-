// ============================================
// SESSION_NOTE TABLE MIGRATION
// ============================================
// A "migration" is a script that creates a database table.
// This one makes sure the "session_note" table exists.

import sequelize from "../../config/db.js";
import SessionNote from "../models/sessionNote.js";

// Async function because database operations take time (they return Promises).
export const createSessionNoteTable = async () => {
    // authenticate() checks that the database connection works
    await sequelize.authenticate();
    // sync() creates the table from the model if it does not exist yet.
    // logging: false -> do not print the raw SQL in the console
    await SessionNote.sync({ logging: false });
    console.log("session_note table created or already exists");
};
