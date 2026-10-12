// ============================================
// SEED ONLY SCRIPT: run with  npm run db-seed
// ============================================
// Inserts the sample data WITHOUT touching the tables.
// (The tables must already exist: run  npm run db-sync  first.)

import sequelize from "../config/db.js";
import "../database/index.js";
import { runAllSeeds } from "../database/seeds/index.js";

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully");
        await runAllSeeds();
        console.log("seeding finished");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
