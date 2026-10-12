import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("therapist")
class Therapist extends Model {}

Therapist.init(
    {
        therapist_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        license_number: { type: DataTypes.STRING(100), allowNull: true },
        specialization: { type: DataTypes.STRING(150), allowNull: true },
        qualifications: { type: DataTypes.TEXT, allowNull: true },
        experience_years: { type: DataTypes.INTEGER, validate: { min: 0 } },
        bio: { type: DataTypes.TEXT, allowNull: true },
        verification_status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "pending" },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
        sequelize,
        modelName: "Therapist",
        tableName: "therapist",
        timestamps: false
    }
);

export default Therapist;
