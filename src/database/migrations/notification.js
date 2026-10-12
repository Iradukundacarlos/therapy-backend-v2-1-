// ============================================
// NOTIFICATION TABLE MIGRATION
// ============================================
// A "migration" is a script that creates a database table.
// This one makes sure the "notification" table exists.

import sequelize from "../../config/db.js";
import Notification from "../models/notification.js";

// Async function because database operations take time (they return Promises).
export const createNotificationTable = async () => {
    // authenticate() checks that the database connection works
    await sequelize.authenticate();
    // sync() creates the table from the model if it does not exist yet.
    // logging: false -> do not print the raw SQL in the console
    await Notification.sync({ logging: false });
    console.log("notification table created or already exists");
};
