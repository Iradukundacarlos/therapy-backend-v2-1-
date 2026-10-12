// ============================================
// APPOINTMENT CONTROLLER
// ============================================
import sequelize from "../config/db.js";
import Appointment from "../database/models/appointment.js";
import Availability from "../database/models/availability.js";
import Client from "../database/models/client.js";
import Therapist from "../database/models/therapist.js";
import User from "../database/models/user.js";
import { getClient } from "../utils/profile.js";
import { notify } from "../utils/notify.js";
import { HttpError, handleError } from "../utils/handleError.js";

const names = { model: User, attributes: ["first_name", "last_name"] };

// ============================================
// BOOK AN APPOINTMENT (client): takes an open slot
// ============================================
export const bookAppointment = async (req, res) => {
    try {
        const { availability_id, reason } = req.body;
        if (!availability_id) return res.status(400).json({ message: "availability_id is required" });

        const client = await getClient(req.user.user_id);
        if (!client) return res.status(400).json({ message: "client profile not found" });

        // TRANSACTION: every step inside is saved together, or none is saved.
        const appointment = await sequelize.transaction(async (t) => {
            // lock the slot so two people cannot book it at the same time
            const slot = await Availability.findByPk(availability_id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!slot) throw new HttpError(404, "availability slot not found");
            if (slot.status !== "open") throw new HttpError(409, "this slot is already booked");

            const created = await Appointment.create(
                {
                    client_id: client.client_id,
                    therapist_id: slot.therapist_id,
                    availability_id: slot.availability_id,
                    appointment_date: slot.available_date,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    reason
                },
                { transaction: t }
            );

            await slot.update({ status: "booked" }, { transaction: t });

            const therapist = await Therapist.findByPk(slot.therapist_id, { transaction: t });
            await notify(
                therapist.user_id,
                "New appointment request",
                `A client booked ${slot.available_date} at ${slot.start_time}.`,
                "appointment",
                t
            );
            return created;
        });

        res.status(201).json({ message: "appointment booked successfully", appointment });
    } catch (error) {
        handleError(res, error);
    }
};

// ============================================
// MY APPOINTMENTS (client: own, therapist: own, admin: all)
// ============================================
export const getMyAppointments = async (req, res) => {
    try {
        const clientInclude = { model: Client, required: true, include: [names] };
        const therapistInclude = { model: Therapist, required: true, include: [names] };

        // only the appointments that belong to the logged-in person
        if (req.user.role === "client") clientInclude.where = { user_id: req.user.user_id };
        if (req.user.role === "therapist") therapistInclude.where = { user_id: req.user.user_id };

        const appointments = await Appointment.findAll({
            include: [clientInclude, therapistInclude],
            order: [["appointment_date", "DESC"], ["start_time", "ASC"]]
        });
        res.status(200).json(appointments);
    } catch (error) {
        handleError(res, error);
    }
};

// ============================================
// ONE APPOINTMENT (client, therapist of it, or admin)
// ============================================
export const SingleAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                { model: Client, include: [names] },
                { model: Therapist, include: [names] }
            ]
        });
        if (!appointment) return res.status(404).json({ message: "appointment not found" });

        const involved = [appointment.Client.user_id, appointment.Therapist.user_id].includes(req.user.user_id);
        if (!involved && req.user.role !== "admin") return res.status(403).json({ message: "access denied" });

        res.status(200).json(appointment);
    } catch (error) {
        handleError(res, error);
    }
};

// ============================================
// UPDATE STATUS: confirmed / cancelled / completed
// Therapist: all three.  Client: cancel only.
// ============================================
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["confirmed", "cancelled", "completed"].includes(status))
            return res.status(400).json({ message: "status must be confirmed, cancelled or completed" });

        const appointment = await Appointment.findByPk(req.params.id, { include: [Client, Therapist] });
        if (!appointment) return res.status(404).json({ message: "appointment not found" });

        const isClient = appointment.Client.user_id === req.user.user_id;
        const isTherapist = appointment.Therapist.user_id === req.user.user_id;

        if (!isClient && !isTherapist) return res.status(403).json({ message: "not your appointment" });
        if (isClient && status !== "cancelled") return res.status(403).json({ message: "clients can only cancel" });
        if (["cancelled", "completed"].includes(appointment.status))
            return res.status(409).json({ message: `appointment is already ${appointment.status}` });

        await appointment.update({ status });

        // a cancelled appointment gives the time slot back
        if (status === "cancelled" && appointment.availability_id) {
            await Availability.update({ status: "open" }, { where: { availability_id: appointment.availability_id } });
        }

        // tell the other person
        const otherUserId = isClient ? appointment.Therapist.user_id : appointment.Client.user_id;
        await notify(
            otherUserId,
            `Appointment ${status}`,
            `The appointment on ${appointment.appointment_date} at ${appointment.start_time} is now ${status}.`,
            "appointment"
        );

        res.status(200).json({ message: `appointment ${status}`, appointment });
    } catch (error) {
        handleError(res, error);
    }
};
