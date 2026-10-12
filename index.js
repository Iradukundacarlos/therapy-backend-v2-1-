// ============================================
// IMPORTING EXTERNAL PACKAGES & LOCAL FILES
// ============================================
// "import" is ES Module syntax for bringing in code from other files or packages.

import "dotenv/config";
// dotenv: loads the .env file into process.env (DB password, JWT secret...).

import express from "express";
// express: the web framework that creates the server and the routes.

import cors from "cors";
// cors: lets a frontend running on another address call our API.

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/docs/swagger.js";
// swagger: an interactive documentation page for our API, served at /docs.

import sequelize from "./src/config/db.js";
// sequelize: the database connection we configured in src/config/db.js.

import "./src/database/index.js";
// loads all the models and their relationships.

import AuthRoutes from "./src/routes/auth.js";
import UserRoutes from "./src/routes/user.js";
import TherapistRoutes from "./src/routes/therapist.js";
import ClientRoutes from "./src/routes/client.js";
import AdministratorRoutes from "./src/routes/administrator.js";
import AvailabilityRoutes from "./src/routes/availability.js";
import AppointmentRoutes from "./src/routes/appointment.js";
import SessionRoutes from "./src/routes/session.js";
import SessionNoteRoutes from "./src/routes/sessionNote.js";
import FeedbackRoutes from "./src/routes/feedback.js";
import AssessmentRoutes from "./src/routes/assessment.js";
import MessageRoutes from "./src/routes/message.js";
import NotificationRoutes from "./src/routes/notification.js";
import ReportRoutes from "./src/routes/report.js";
// Our route files. Each one defines the URLs of one feature.

// ============================================
// CREATING THE EXPRESS APPLICATION
// ============================================
const app = express();

// ============================================
// MIDDLEWARE: functions that run on every request
// ============================================

// express.json() turns the JSON text sent by Postman into the object req.body.
app.use(express.json());

// Makes sure req.body is never "undefined" (when a request has no body).
app.use((req, res, next) => {
    req.body = req.body || {};
    next();
});

// Swagger documentation page: http://localhost:5000/docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS: which frontend addresses and which methods are allowed.
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
);

// A simple route to check the server is alive.
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Register our route modules so Express knows which function to call for each URL.
app.use(AuthRoutes);
app.use(UserRoutes);
app.use(TherapistRoutes);
app.use(ClientRoutes);
app.use(AdministratorRoutes);
app.use(AvailabilityRoutes);
app.use(AppointmentRoutes);
app.use(SessionRoutes);
app.use(SessionNoteRoutes);
app.use(FeedbackRoutes);
app.use(AssessmentRoutes);
app.use(MessageRoutes);
app.use(NotificationRoutes);
app.use(ReportRoutes);

// If no route matched, answer 404.
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ============================================
// SERVER CONFIGURATION
// ============================================
// Use PORT from .env, or 5000 if it is not set.
const PORT = process.env.PORT || 5000;

// ============================================
// DATABASE CONNECTION & SERVER STARTUP
// ============================================
// 1) authenticate(): are the database credentials correct?
// 2) sync(): create any table that is missing.
// 3) app.listen(): start the web server.
sequelize
    .authenticate()
    .then(() => {
        console.log("Your Database connected successfully");
        return sequelize.sync();
    })
    .then(() =>
        app.listen(PORT, () => console.log(`Your Server is running on port ${PORT}`))
    )
    .catch((error) => console.log("unable to connect to the database:", error));

// Export the app so it can be imported elsewhere (for example in tests).
export default app;
