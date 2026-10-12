import Notification from "../database/models/notification.js";

// Saves one notification for one user. "transaction" is optional.
export const notify = (userId, title, message, type, transaction) =>
    Notification.create(
        { user_id: userId, title, message, notification_type: type },
        { transaction }
    );
