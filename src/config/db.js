// ============================================
// DATABASE CONNECTION CONFIGURATION
// ============================================
// This file sets up the connection between our app and a PostgreSQL database
// using Sequelize, an ORM (Object-Relational Mapper).
// Sequelize lets us use JavaScript objects instead of writing raw SQL.

import { Sequelize } from "sequelize";
// Sequelize is a class. We import it to create one database connection.

import dotenv from "dotenv";
dotenv.config();
// dotenv reads our .env file and puts the values into process.env,
// so secrets (password...) are never written inside the code.

// new Sequelize(dbName, dbUser, dbPassword, { options })
const sequelize = new Sequelize(
    process.env.DB_NAME,      // Name of the database
    process.env.DB_USER,      // Database username
    process.env.DB_PASSWORD,  // Database password
    {
        host: process.env.DB_HOST,       // Where the database lives (localhost)
        port: process.env.DB_PORT,       // PostgreSQL port (usually 5432)
        dialect: "postgres",             // The type of database we use
        logging: false,                  // true/console.log = print every SQL query
        dialectOptions: {
            connectTimeout: 3000         // Give up after 3 seconds
        },
        pool: {
            max: 2,        // Maximum connections kept open
            min: 0,        // Minimum connections
            acquire: 3000, // Max time (ms) to wait for a connection
            idle: 10000    // Time (ms) a connection can stay unused
        }
    }
);

// Export so every model imports the SAME connection.
export default sequelize;
