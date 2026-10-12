// ============================================
// ADMINISTRATOR CONTROLLER
// ============================================
import Administrator from "../database/models/administrator.js";
import User from "../database/models/user.js";
import { handleError } from "../utils/handleError.js";

// GET ALL ADMINISTRATORS (admin only)
export const getAllAdministrators = async (req, res) => {
    try {
        const administrators = await Administrator.findAll({
            include: [{ model: User, attributes: ["first_name", "last_name", "email"] }]
        });
        res.status(200).json(administrators);
    } catch (error) {
        handleError(res, error);
    }
};
