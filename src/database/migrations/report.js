// ============================================
// REPORT TABLE MIGRATION
// ============================================
// A "migration" is a script that creates a database table.
// This one makes sure the "report" table exists.

import sequelize from "../../config/db.js";
import Report from "../models/report.js";

// Async function because database operations take time (they return Promises).
export const createReportTable = async () => {
    // authenticate() checks that the database connection works
    await sequelize.authenticate();
    // sync() creates the table from the model if it does not exist yet.
    // logging: false -> do not print the raw SQL in the console
    await Report.sync({ logging: false });
    console.log("report table created or already exists");
};
