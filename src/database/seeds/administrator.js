import Administrator from "../models/administrator.js";
import { getUserId } from "./helpers.js";

export const seedAdministrators = async () => {
    // look up the REAL id of the admin user, then link the profile to it
    const administrators = [{ user_id: await getUserId("admin@therapy.com") }];

    // user_id is UNIQUE in this table, so a second run skips the duplicate
    await Administrator.bulkCreate(administrators, { ignoreDuplicates: true });
    console.log("administrators seeded");
};
