import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("assessment")
class Assessment extends Model {}

Assessment.init(
    {
        assessment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        client_id: { type: DataTypes.INTEGER, allowNull: false },
        main_concern: { type: DataTypes.TEXT, allowNull: true },
        preferred_therapy: { type: DataTypes.STRING(100), allowNull: true },
        preferred_language: { type: DataTypes.STRING(50), allowNull: true },
        preferred_time: { type: DataTypes.STRING(50), allowNull: true },
        completed_at: { type: DataTypes.DATE, allowNull: true }
    },
    {
        sequelize,
        modelName: "Assessment",
        tableName: "assessment",
        timestamps: false
    }
);

export default Assessment;
