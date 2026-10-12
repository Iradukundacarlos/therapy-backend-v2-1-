import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("feedback")
class Feedback extends Model {}

Feedback.init(
    {
        feedback_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        session_id: { type: DataTypes.INTEGER, allowNull: false },
        client_id: { type: DataTypes.INTEGER, allowNull: false },
        rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
        comment: { type: DataTypes.TEXT, allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
        sequelize,
        modelName: "Feedback",
        tableName: "feedback",
        timestamps: false
    }
);

export default Feedback;
