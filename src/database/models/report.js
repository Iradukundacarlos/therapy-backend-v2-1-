import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("report")
class Report extends Model {}

Report.init(
    {
        report_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        reporter_id: { type: DataTypes.INTEGER, allowNull: false },
        reported_user_id: { type: DataTypes.INTEGER, allowNull: false },
        subject: { type: DataTypes.STRING(200), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "open" },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        resolved_at: { type: DataTypes.DATE, allowNull: true }
    },
    {
        sequelize,
        modelName: "Report",
        tableName: "report",
        timestamps: false
    }
);

export default Report;
