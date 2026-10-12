// ============================================
// NOTIFICATION CONTROLLER
// ============================================
// Notifications are CREATED automatically by other controllers
// (for example when an appointment is booked). Here the user reads them.
import Notification from "../database/models/notification.js";
import { handleError } from "../utils/handleError.js";

// MY NOTIFICATIONS (newest first)
export const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: req.user.user_id },
            order: [["created_at", "DESC"]]
        });
        res.status(200).json(notifications);
    } catch (error) {
        handleError(res, error);
    }
};

// MARK ONE AS READ
export const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: { notification_id: req.params.id, user_id: req.user.user_id }
        });
        if (!notification) return res.status(404).json({ message: "notification not found" });

        await notification.update({ is_read: true });
        res.status(200).json({ message: "notification marked as read", notification });
    } catch (error) {
        handleError(res, error);
    }
};

// MARK ALL OF MY NOTIFICATIONS AS READ
export const markAllNotificationsRead = async (req, res) => {
    try {
        const [count] = await Notification.update(
            { is_read: true },
            { where: { user_id: req.user.user_id, is_read: false } }
        );
        res.status(200).json({ message: "all notifications marked as read", updated: count });
    } catch (error) {
        handleError(res, error);
    }
};
