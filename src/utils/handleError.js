// ============================================
// ERROR HELPER used in every controller's catch block
// ============================================
// The lecturer writes  res.status(500).json({ error: error.message })  in each catch.
// We do the same, but first we turn the COMMON database errors into friendly
// messages (400 / 409) instead of a scary 500.

// Use it like:  throw new HttpError(404, "Therapist not found")
export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export const handleError = (res, error) => {
    // errors we threw ourselves
    if (error.status) return res.status(error.status).json({ message: error.message });

    // errors coming from Sequelize / the database
    if (error.name === "SequelizeUniqueConstraintError")
        return res.status(409).json({ message: "That value already exists (duplicate)" });
    if (error.name === "SequelizeValidationError")
        return res.status(400).json({ message: error.errors.map((e) => e.message).join(", ") });
    if (error.name === "SequelizeForeignKeyConstraintError")
        return res.status(400).json({ message: "Related record not found or still in use (check the ids)" });
    if (error.name === "SequelizeDatabaseError")
        return res.status(400).json({ message: "Invalid value (check ids, dates and times)" });

    // anything else = a real server error
    console.error(error);
    return res.status(500).json({ error: error.message });
};
