// ============================================
// THERAPIST ROUTES
// ============================================
import express from "express";
import {
    getAllTherapists,
    SingleTherapist,
    getMyTherapistProfile,
    updateMyTherapistProfile,
    verifyTherapist
} from "../controllers/therapist.js";
import { Protect, AllowedRoles } from "../middleware/auth.js";

const TherapistRoutes = express.Router();

// GET /api/getAllTherapists: clients see verified therapists only, admin sees all
TherapistRoutes.get("/api/getAllTherapists", Protect, getAllTherapists);

// GET /api/getTherapist/:id
TherapistRoutes.get("/api/getTherapist/:id", Protect, SingleTherapist);

// GET /api/getMyTherapistProfile (therapist)
TherapistRoutes.get("/api/getMyTherapistProfile", Protect, AllowedRoles("therapist"), getMyTherapistProfile);

// PUT /api/updateMyTherapistProfile (therapist)
TherapistRoutes.put("/api/updateMyTherapistProfile", Protect, AllowedRoles("therapist"), updateMyTherapistProfile);

// PUT /api/verifyTherapist/:id (admin): verified / rejected / pending
TherapistRoutes.put("/api/verifyTherapist/:id", Protect, AllowedRoles("admin"), verifyTherapist);

export default TherapistRoutes;
