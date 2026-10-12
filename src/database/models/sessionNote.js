import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

// Model = one JavaScript class that represents one table ("session_note")
class SessionNote extends Model {}

SessionNote.init(
    {
        note_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        session_id: { type: DataTypes.INTEGER, allowNull: false },
        therapist_id: { type: DataTypes.INTEGER, allowNull: false },
        note_content: { type: DataTypes.TEXT, allowNull: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
        sequelize,
        modelName: "SessionNote",
        tableName: "session_note",
        timestamps: false
    }
);

export default SessionNote;
