import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("message")
class Message extends Model {}

Message.init(
    {
        message_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        sender_id: { type: DataTypes.INTEGER, allowNull: false },
        receiver_id: { type: DataTypes.INTEGER, allowNull: false },
        message_text: { type: DataTypes.TEXT, allowNull: false },
        sent_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    },
    {
        sequelize,
        modelName: "Message",
        tableName: "message",
        timestamps: false
    }
);

export default Message;
