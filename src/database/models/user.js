import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("users")
class User extends Model {}

User.init(
    {
        user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        first_name: { type: DataTypes.STRING(100), allowNull: false },
        last_name: { type: DataTypes.STRING(100), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
        password: { type: DataTypes.STRING(255), allowNull: false },
        phone: { type: DataTypes.STRING(30), allowNull: true },
        role: { type: DataTypes.STRING(20), allowNull: false, validate: { isIn: [["client", "therapist", "admin"]] } },
        status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "active" },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: false
    }
);

export default User;
