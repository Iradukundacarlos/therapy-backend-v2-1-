import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("client")
class Client extends Model {}

Client.init(
    {
        client_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        date_of_birth: { type: DataTypes.DATEONLY, allowNull: true },
        gender: { type: DataTypes.STRING(30), allowNull: true },
        preferred_language: { type: DataTypes.STRING(50), allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
        sequelize,
        modelName: "Client",
        tableName: "client",
        timestamps: false
    }
);

export default Client;
