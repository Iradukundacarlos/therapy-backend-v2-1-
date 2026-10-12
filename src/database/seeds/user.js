// ============================================
// USER SEED: fills the "users" table with sample data
// ============================================
// A "seed" is a script that inserts example data, so the tables are not empty.

import User from "../models/user.js";
import bcrypt from "bcryptjs";
// bcrypt hashes (scrambles) passwords. We never store a real password.

export const seedUsers = async () => {
    // Hash the password "Test123". 8 = how many rounds of scrambling.
    const hashPassword = await bcrypt.hash("Test123", 8);

    // An array of objects. Each object matches the fields of the User model.
    const users = [
        { first_name: "System", last_name: "Admin", email: "admin@therapy.com", phone: "+250788000001", password: hashPassword, role: "admin", status: "active" },

        { first_name: "Amina", last_name: "Uwase", email: "amina@therapy.com", phone: "+250788000010", password: hashPassword, role: "therapist", status: "active" },
        { first_name: "Jean Bosco", last_name: "Nkurunziza", email: "jean@therapy.com", phone: "+250788000011", password: hashPassword, role: "therapist", status: "active" },
        { first_name: "Grace", last_name: "Mukamana", email: "grace@therapy.com", phone: "+250788000012", password: hashPassword, role: "therapist", status: "active" },

        { first_name: "Eric", last_name: "Ishimwe", email: "eric@therapy.com", phone: "+250788000020", password: hashPassword, role: "client", status: "active" },
        { first_name: "Aline", last_name: "Uwimana", email: "aline@therapy.com", phone: "+250788000021", password: hashPassword, role: "client", status: "active" },
        { first_name: "Patrick", last_name: "Habimana", email: "patrick@therapy.com", phone: "+250788000022", password: hashPassword, role: "client", status: "active" },
        { first_name: "Diane", last_name: "Mutesi", email: "diane@therapy.com", phone: "+250788000023", password: hashPassword, role: "client", status: "active" }
    ];

    // bulkCreate inserts many rows at once.
    // ignoreDuplicates: true = skip a row if that email already exists (so we can run the seed twice).
    await User.bulkCreate(users, { ignoreDuplicates: true });
    console.log("users seeded");
};
