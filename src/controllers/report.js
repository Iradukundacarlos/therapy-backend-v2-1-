// ============================================
// REPORT CONTROLLER: a user reports another user, an admin handles it
// ============================================
import Report from "../database/models/report.js";
import User from "../database/models/user.js";
import { handleError } from "../utils/handleError.js";

const people = [
    { model: User, as: "reporter", attributes: ["user_id", "first_name", "last_name"] },
    { model: User, as: "reportedUser", attributes: ["user_id", "first_name", "last_name"] }
];

// CREATE A REPORT (any logged-in user)
export const createReport = async (req, res) => {
    try {
        const { reported_user_id, subject, description } = req.body;
        if (!reported_user_id || !subject)
            return res.status(400).json({ message: "reported_user_id and subject are required" });
        if (Number(reported_user_id) === req.user.user_id)
            return res.status(400).json({ message: "you cannot report yourself" });

        const report = await Report.create({
            reporter_id: req.user.user_id,
            reported_user_id,
            subject,
            description
        });
        res.status(201).json({ message: "report sent successfully", report });
    } catch (error) {
        handleError(res, error);
    }
};

// ALL REPORTS (admin only)
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({ include: people, order: [["created_at", "DESC"]] });
        res.status(200).json(reports);
    } catch (error) {
        handleError(res, error);
    }
};

// MY REPORTS (the ones I sent)
export const getMyReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            where: { reporter_id: req.user.user_id },
            order: [["created_at", "DESC"]]
        });
        res.status(200).json(reports);
    } catch (error) {
        handleError(res, error);
    }
};

// UPDATE THE STATUS OF A REPORT (admin only): open / in_review / resolved
export const updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["open", "in_review", "resolved"].includes(status))
            return res.status(400).json({ message: "status must be open, in_review or resolved" });

        const report = await Report.findByPk(req.params.id);
        if (!report) return res.status(404).json({ message: "report not found" });

        await report.update({ status, resolved_at: status === "resolved" ? new Date() : null });
        res.status(200).json({ message: "report updated", report });
    } catch (error) {
        handleError(res, error);
    }
};
