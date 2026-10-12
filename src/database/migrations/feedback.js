// ============================================
// FEEDBACK TABLE MIGRATION
// ============================================
// A "migration" is a script that creates a database table.
// This one makes sure the "feedback" table exists.

import sequelize from "../../config/db.js";
import Feedback from "../models/feedback.js";

// Async function because database operations take time (they return Promises).
export const createFeedbackTable = async () => {
    // authenticate() checks that the database connection works
    await sequelize.authenticate();
    // sync() creates the table from the model if it does not exist yet.
    // logging: false -> do not print the raw SQL in the console
    await Feedback.sync({ logging: false });
    console.log("feedback table created or already exists");
};
