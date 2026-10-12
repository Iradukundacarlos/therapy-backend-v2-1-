import Client from "../models/client.js";
import { getUserId } from "./helpers.js";

export const seedClients = async () => {
    const clients = [
        { user_id: await getUserId("eric@therapy.com"), date_of_birth: "1998-05-14", gender: "male", preferred_language: "English" },
        { user_id: await getUserId("aline@therapy.com"), date_of_birth: "1995-11-02", gender: "female", preferred_language: "Kinyarwanda" },
        { user_id: await getUserId("patrick@therapy.com"), date_of_birth: "1990-03-21", gender: "male", preferred_language: "French" },
        { user_id: await getUserId("diane@therapy.com"), date_of_birth: "2000-08-30", gender: "female", preferred_language: "English" }
    ];
    await Client.bulkCreate(clients, { ignoreDuplicates: true });
    console.log("clients seeded");
};
