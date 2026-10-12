import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("appointment")
class Appointment extends Model {}

Appointment.init(
    {
        appointment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        client_id: { type: DataTypes.INTEGER, allowNull: false },
        therapist_id: { type: DataTypes.INTEGER, allowNull: false },
        availability_id: { type: DataTypes.INTEGER, allowNull: true },
        appointment_date: { type: DataTypes.DATEONLY, allowNull: false },
        start_time: { type: DataTypes.TIME, allowNull: false },
        end_time: { type: DataTypes.TIME, allowNull: false },
        status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "scheduled" },
        reason: { type: DataTypes.TEXT, allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
        sequelize,
        modelName: "Appointment",
        tableName: "appointment",
        timestamps: false
    }
);

export default Appointment;
