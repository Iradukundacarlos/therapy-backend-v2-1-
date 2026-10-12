import Client from "../database/models/client.js";
import Therapist from "../database/models/therapist.js";

// A logged-in USER is a row in "users". Their PROFILE is a row in "client" or "therapist".
// These helpers find the profile that belongs to a user id.
export const getClient = (userId) => Client.findOne({ where: { user_id: userId } });
export const getTherapist = (userId) => Therapist.findOne({ where: { user_id: userId } });
