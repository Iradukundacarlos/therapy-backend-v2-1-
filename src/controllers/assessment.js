// ============================================
// ASSESSMENT CONTROLLER: the questionnaire a client fills in
// ============================================
import Assessment from "../database/models/assessment.js";
import { getClient } from "../utils/profile.js";
import { handleError } from "../utils/handleError.js";

// CREATE AN ASSESSMENT (client)
export const createAssessment = async (req, res) => {
    try {
        const { main_concern, preferred_therapy, preferred_language, preferred_time } = req.body;
        if (!main_concern) return res.status(400).json({ message: "main_concern is required" });

        const client = await getClient(req.user.user_id);
        if (!client) return res.status(400).json({ message: "client profile not found" });

        const assessment = await Assessment.create({
            client_id: client.client_id,
            main_concern,
            preferred_therapy,
            preferred_language,
            preferred_time,
            completed_at: new Date()
        });
        res.status(201).json({ message: "assessment saved successfully", assessment });
    } catch (error) {
        handleError(res, error);
    }
};

// MY ASSESSMENTS (client)
export const getMyAssessments = async (req, res) => {
    try {
        const client = await getClient(req.user.user_id);
        if (!client) return res.status(400).json({ message: "client profile not found" });

        const assessments = await Assessment.findAll({
            where: { client_id: client.client_id },
            order: [["completed_at", "DESC"]]
        });
        res.status(200).json(assessments);
    } catch (error) {
        handleError(res, error);
    }
};
