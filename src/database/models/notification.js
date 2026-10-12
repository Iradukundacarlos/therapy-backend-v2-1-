import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("notification")
class Notification extends Model {}

Notification.init(
    {
        notification_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        title: { type: DataTypes.STRING(200), allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: true },
        notification_type: { type: DataTypes.STRING(50), allowNull: true },
        is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
        sequelize,
        modelName: "Notification",
        tableName: "notification",
        timestamps: false
    }
);

export default Notification;
