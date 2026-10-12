import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("administrator")
class Administrator extends Model {}

Administrator.init(
    {
        admin_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true }
    },
    {
        sequelize,
        modelName: "Administrator",
        tableName: "administrator",
        timestamps: false
    }
);

export default Administrator;
