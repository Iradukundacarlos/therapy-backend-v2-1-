// ============================================
// AVAILABILITY CONTROLLER: the time slots a therapist offers
// ============================================
import { Op } from "sequelize";
import Availability from "../database/models/availability.js";
import { getTherapist } from "../utils/profile.js";
import { pick } from "../utils/pick.js";
import { handleError } from "../utils/handleError.js";

// Checks that a new slot does not overlap another slot of the same therapist
const findOverlap = (therapistId, date, start, end, ignoreId) => {
    const where = {
        therapist_id: therapistId,
        available_date: date,
        status: { [Op.ne]: "cancelled" },
        start_time: { [Op.lt]: end },   // existing slot starts before the new one ends
        end_time: { [Op.gt]: start }    // and ends after the new one starts
    };
    if (ignoreId) where.availability_id = { [Op.ne]: ignoreId };
    return Availability.findOne({ where });
};

// CREATE A SLOT (therapist)
export const createAvailability = async (req, res) => {
    try {
        const { available_date, start_time, end_time } = req.body;
        if (!available_date || !start_time || !end_time)
            return res.status(400).json({ message: "available_date, start_time and end_time are required" });
        if (end_time <= start_time)
            return res.status(400).json({ message: "end_time must be after start_time" });

        const therapist = await getTherapist(req.user.user_id);
        if (!therapist) return res.status(400).json({ message: "therapist profile not found" });

        if (await findOverlap(therapist.therapist_id, available_date, start_time, end_time))
            return res.status(409).json({ message: "this slot overlaps one you already have" });

        const slot = await Availability.create({
            therapist_id: therapist.therapist_id,
            available_date,
            start_time,
            end_time
        });
        res.status(201).json({ message: "availability created successfully", slot });
    } catch (error) {
        handleError(res, error);
    }
};

// MY SLOTS (therapist)
export const getMyAvailability = async (req, res) => {
    try {
        const therapist = await getTherapist(req.user.user_id);
        if (!therapist) return res.status(400).json({ message: "therapist profile not found" });

        const slots = await Availability.findAll({
            where: { therapist_id: therapist.therapist_id },
            order: [["available_date", "ASC"], ["start_time", "ASC"]]
        });
        res.status(200).json(slots);
    } catch (error) {
        handleError(res, error);
    }
};

// OPEN FUTURE SLOTS OF ONE THERAPIST (anyone logged in: this is what a client books from)
export const getTherapistAvailability = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const slots = await Availability.findAll({
            where: {
                therapist_id: req.params.therapistId,
                status: "open",
                available_date: { [Op.gte]: today }
            },
            order: [["available_date", "ASC"], ["start_time", "ASC"]]
        });
        res.status(200).json(slots);
    } catch (error) {
        handleError(res, error);
    }
};

// UPDATE A SLOT (therapist, own slot, only while it is still open)
export const updateAvailability = async (req, res) => {
    try {
        const therapist = await getTherapist(req.user.user_id);
        if (!therapist) return res.status(400).json({ message: "therapist profile not found" });

        const slot = await Availability.findOne({
            where: { availability_id: req.params.id, therapist_id: therapist.therapist_id }
        });
        if (!slot) return res.status(404).json({ message: "slot not found" });
        if (slot.status !== "open") return res.status(409).json({ message: "a booked slot cannot be changed" });

        const changes = pick(req.body, ["available_date", "start_time", "end_time"]);
        const date = changes.available_date || slot.available_date;
        const start = changes.start_time || slot.start_time;
        const end = changes.end_time || slot.end_time;

        if (end <= start) return res.status(400).json({ message: "end_time must be after start_time" });
        if (await findOverlap(therapist.therapist_id, date, start, end, slot.availability_id))
            return res.status(409).json({ message: "this slot overlaps one you already have" });

        await slot.update(changes);
        res.status(200).json({ message: "availability updated successfully", slot });
    } catch (error) {
        handleError(res, error);
    }
};

// DELETE A SLOT (therapist, own slot, only while it is still open)
export const deleteAvailability = async (req, res) => {
    try {
        const therapist = await getTherapist(req.user.user_id);
        if (!therapist) return res.status(400).json({ message: "therapist profile not found" });

        const deleted = await Availability.destroy({
            where: { availability_id: req.params.id, therapist_id: therapist.therapist_id, status: "open" }
        });
        if (!deleted) return res.status(404).json({ message: "slot not found, not yours, or already booked" });
        res.status(200).json({ message: "availability deleted successfully" });
    } catch (error) {
        handleError(res, error);
    }
};
