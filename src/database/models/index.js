// ============================================
// MODELS INDEX: all models + their relationships
// ============================================
// Gathers every model in one object and describes the lines of the ERD:
//   hasOne / hasMany / belongsTo.
// The table that holds the foreign key is the one that "belongsTo" the other.

import sequelize from "../../config/db.js";

import User from "./user.js";
import Therapist from "./therapist.js";
import Client from "./client.js";
import Administrator from "./administrator.js";
import Availability from "./availability.js";
import Appointment from "./appointment.js";
import TherapySession from "./therapySession.js";
import SessionNote from "./sessionNote.js";
import Feedback from "./feedback.js";
import Assessment from "./assessment.js";
import Message from "./message.js";
import Notification from "./notification.js";
import Report from "./report.js";

// A user can be a therapist, a client or an administrator (one profile each)
User.hasOne(Therapist, { foreignKey: "user_id", onDelete: "CASCADE" });
Therapist.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(Client, { foreignKey: "user_id", onDelete: "CASCADE" });
Client.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(Administrator, { foreignKey: "user_id", onDelete: "CASCADE" });
Administrator.belongsTo(User, { foreignKey: "user_id" });

// A therapist sets many availability slots
Therapist.hasMany(Availability, { foreignKey: "therapist_id", onDelete: "CASCADE" });
Availability.belongsTo(Therapist, { foreignKey: "therapist_id" });

// An appointment belongs to a client, a therapist and (optionally) a slot
Client.hasMany(Appointment, { foreignKey: "client_id" });
Appointment.belongsTo(Client, { foreignKey: "client_id" });

Therapist.hasMany(Appointment, { foreignKey: "therapist_id" });
Appointment.belongsTo(Therapist, { foreignKey: "therapist_id" });

Availability.hasMany(Appointment, { foreignKey: "availability_id" });
Appointment.belongsTo(Availability, { foreignKey: "availability_id" });

// One appointment creates (at most) one therapy session
Appointment.hasOne(TherapySession, { foreignKey: "appointment_id", onDelete: "CASCADE" });
TherapySession.belongsTo(Appointment, { foreignKey: "appointment_id" });

// A session has notes (written by the therapist) and feedback (from the client)
TherapySession.hasMany(SessionNote, { foreignKey: "session_id", onDelete: "CASCADE" });
SessionNote.belongsTo(TherapySession, { foreignKey: "session_id" });
Therapist.hasMany(SessionNote, { foreignKey: "therapist_id" });
SessionNote.belongsTo(Therapist, { foreignKey: "therapist_id" });

TherapySession.hasMany(Feedback, { foreignKey: "session_id", onDelete: "CASCADE" });
Feedback.belongsTo(TherapySession, { foreignKey: "session_id" });
Client.hasMany(Feedback, { foreignKey: "client_id" });
Feedback.belongsTo(Client, { foreignKey: "client_id" });

// A client completes assessments
Client.hasMany(Assessment, { foreignKey: "client_id", onDelete: "CASCADE" });
Assessment.belongsTo(Client, { foreignKey: "client_id" });

// Messages: two links to User (who sent it, who receives it)
User.hasMany(Message, { as: "sentMessages", foreignKey: "sender_id" });
User.hasMany(Message, { as: "receivedMessages", foreignKey: "receiver_id" });
Message.belongsTo(User, { as: "sender", foreignKey: "sender_id" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiver_id" });

// Notifications belong to one user
User.hasMany(Notification, { foreignKey: "user_id", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "user_id" });

// Reports: who reported, and who was reported
User.hasMany(Report, { as: "reportsMade", foreignKey: "reporter_id" });
User.hasMany(Report, { as: "reportsReceived", foreignKey: "reported_user_id" });
Report.belongsTo(User, { as: "reporter", foreignKey: "reporter_id" });
Report.belongsTo(User, { as: "reportedUser", foreignKey: "reported_user_id" });

// Group everything in one object for easy access.
const db = {
    sequelize,
    User,
    Therapist,
    Client,
    Administrator,
    Availability,
    Appointment,
    TherapySession,
    SessionNote,
    Feedback,
    Assessment,
    Message,
    Notification,
    Report
};
export default db;
