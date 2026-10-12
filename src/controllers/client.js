// ============================================
// CLIENT CONTROLLER
// ============================================
import Client from "../database/models/client.js";
import User from "../database/models/user.js";
import { pick } from "../utils/pick.js";
import { handleError } from "../utils/handleError.js";

const withUser = [{ model: User, attributes: ["first_name", "last_name", "email", "phone"] }];

// GET ALL CLIENTS (admin only)
export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll({ include: withUser, order: [["client_id", "ASC"]] });
        res.status(200).json(clients);
    } catch (error) {
        handleError(res, error);
    }
};

// GET MY PROFILE (the logged-in client)
export const getMyClientProfile = async (req, res) => {
    try {
        const client = await Client.findOne({ where: { user_id: req.user.user_id }, include: withUser });
        if (!client) return res.status(404).json({ message: "client profile not found" });
        res.status(200).json(client);
    } catch (error) {
        handleError(res, error);
    }
};

// UPDATE MY PROFILE
export const updateMyClientProfile = async (req, res) => {
    try {
        const client = await Client.findOne({ where: { user_id: req.user.user_id } });
        if (!client) return res.status(404).json({ message: "client profile not found" });

        await client.update(pick(req.body, ["date_of_birth", "gender", "preferred_language"]));
        res.status(200).json({ message: "profile updated successfully", client });
    } catch (error) {
        handleError(res, error);
    }
};
