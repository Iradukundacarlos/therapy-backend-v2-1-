// ============================================
// MESSAGE CONTROLLER: chat between two users
// ============================================
import { Op } from "sequelize";
import Message from "../database/models/message.js";
import User from "../database/models/user.js";
import { handleError } from "../utils/handleError.js";

// SEND A MESSAGE   body: { receiver_id (a user id), message_text }
export const sendMessage = async (req, res) => {
    try {
        const { receiver_id, message_text } = req.body;
        if (!receiver_id || !message_text)
            return res.status(400).json({ message: "receiver_id and message_text are required" });
        if (Number(receiver_id) === req.user.user_id)
            return res.status(400).json({ message: "you cannot message yourself" });

        const message = await Message.create({
            sender_id: req.user.user_id,
            receiver_id,
            message_text
        });
        res.status(201).json({ message: "message sent", data: message });
    } catch (error) {
        handleError(res, error);
    }
};

// MY INBOX: the messages I received (newest first)
export const getInbox = async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: { receiver_id: req.user.user_id },
            include: [{ model: User, as: "sender", attributes: ["user_id", "first_name", "last_name"] }],
            order: [["sent_at", "DESC"]]
        });
        res.status(200).json(messages);
    } catch (error) {
        handleError(res, error);
    }
};

// THE CONVERSATION between me and another user (oldest first)
export const getConversation = async (req, res) => {
    try {
        const me = req.user.user_id;
        const other = req.params.otherUserId;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: me, receiver_id: other },
                    { sender_id: other, receiver_id: me }
                ]
            },
            order: [["sent_at", "ASC"]]
        });
        res.status(200).json(messages);
    } catch (error) {
        handleError(res, error);
    }
};

// MARK A MESSAGE AS READ (only the receiver can)
export const markMessageRead = async (req, res) => {
    try {
        const message = await Message.findOne({
            where: { message_id: req.params.id, receiver_id: req.user.user_id }
        });
        if (!message) return res.status(404).json({ message: "message not found for you" });

        await message.update({ is_read: true });
        res.status(200).json({ message: "message marked as read", data: message });
    } catch (error) {
        handleError(res, error);
    }
};
