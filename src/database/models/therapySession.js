import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("therapy_session")
class TherapySession extends Model {}

TherapySession.init(
    {
        session_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        appointment_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        session_type: { type: DataTypes.STRING(30), allowNull: true },
        meeting_link: { type: DataTypes.STRING(500), allowNull: true },
        started_at: { type: DataTypes.DATE, allowNull: true },
        ended_at: { type: DataTypes.DATE, allowNull: true },
        status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "scheduled" }
    },
    {
        sequelize,
        modelName: "TherapySession",
        tableName: "therapy_session",
        timestamps: false
    }
);

export default TherapySession;
