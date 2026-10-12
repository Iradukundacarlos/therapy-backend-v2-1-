// ============================================
// SEED HELPERS
// ============================================
// Small functions shared by the seed files.
// IMPORTANT IDEA: the database gives every row a new id when it is created.
// So seeds must NEVER guess ids. They look the rows up (here: by email) and use the real ids.

import User from "../models/user.js";
import Therapist from "../models/therapist.js";
import Client from "../models/client.js";

// today + n days, as "YYYY-MM-DD"   (negative n = in the past)
export const daysFromNow = (n) => {
    const date = new Date();
    date.setDate(date.getDate() + n);
    return date.toISOString().slice(0, 10);
};

// find the user_id of a seeded user from the email
export const getUserId = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error(`Seed problem: user ${email} not found. Seed users first.`);
    return user.user_id;
};

// find the therapist_id / client_id from the user's email
export const getTherapistId = async (email) => {
    const therapist = await Therapist.findOne({ where: { user_id: await getUserId(email) } });
    if (!therapist) throw new Error(`Seed problem: therapist profile for ${email} not found.`);
    return therapist.therapist_id;
};

export const getClientId = async (email) => {
    const client = await Client.findOne({ where: { user_id: await getUserId(email) } });
    if (!client) throw new Error(`Seed problem: client profile for ${email} not found.`);
    return client.client_id;
};

// minutes ago, as a Date (used to give messages a believable time)
export const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000);
