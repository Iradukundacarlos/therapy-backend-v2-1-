// ============================================
// RESET SCRIPT: run with  npm run db-reset
// ============================================
// DANGER: deletes ALL tables and ALL data, then creates empty tables again.
// Use it only while developing. Run  npm run db-seed  afterwards to refill.

import sequelize from "../config/db.js";
import "../database/index.js";

const resetDatabase = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true, logging: false });
        console.log("database reset: all tables dropped and recreated (empty)");
        process.exit(0);
    } catch (error) {
        console.error("Reset failed:", error);
        process.exit(1);
    }
};

resetDatabase();
