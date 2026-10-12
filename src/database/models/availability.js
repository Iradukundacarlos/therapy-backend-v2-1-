import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("availability")
class Availability extends Model {}

Availability.init(
    {
        availability_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        therapist_id: { type: DataTypes.INTEGER, allowNull: false },
        available_date: { type: DataTypes.DATEONLY, allowNull: false },
        start_time: { type: DataTypes.TIME, allowNull: false },
        end_time: { type: DataTypes.TIME, allowNull: false },
        status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "open" }
    },
    {
        sequelize,
        modelName: "Availability",
        tableName: "availability",
        timestamps: false
    }
);

export default Availability;
