// ============================================
// USERS TABLE MIGRATION
// ============================================
// A "migration" is a script that creates a database table.
// This one makes sure the "users" table exists.

import sequelize from "../../config/db.js";
import User from "../models/user.js";

// Async function because database operations take time (they return Promises).
export const createUserTable = async () => {
    // authenticate() checks that the database connection works
    await sequelize.authenticate();
    // sync() creates the table from the model if it does not exist yet.
    // logging: false -> do not print the raw SQL in the console
    await User.sync({ logging: false });
    console.log("users table created or already exists");
};
