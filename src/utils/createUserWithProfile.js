import sequelize from "../config/db.js";
import User from "../database/models/user.js";
import Client from "../database/models/client.js";
import Therapist from "../database/models/therapist.js";
import Administrator from "../database/models/administrator.js";

// Creates the USER row and the matching PROFILE row (client / therapist / admin)
// inside ONE transaction: either both are saved, or nothing is saved.
export const createUserWithProfile = async (body, hashedPassword) => {
    return sequelize.transaction(async (t) => {
        const user = await User.create(
            {
                first_name: body.first_name,
                last_name: body.last_name,
                email: body.email.toLowerCase(),
                password: hashedPassword,
                phone: body.phone,
                role: body.role
            },
            { transaction: t }
        );

        if (body.role === "client") {
            await Client.create(
                {
                    user_id: user.user_id,
                    date_of_birth: body.date_of_birth,
                    gender: body.gender,
                    preferred_language: body.preferred_language
                },
                { transaction: t }
            );
        } else if (body.role === "therapist") {
            await Therapist.create(
                {
                    user_id: user.user_id,
                    license_number: body.license_number,
                    specialization: body.specialization,
                    qualifications: body.qualifications,
                    experience_years: body.experience_years,
                    bio: body.bio
                },
                { transaction: t }
            );
        } else if (body.role === "admin") {
            await Administrator.create({ user_id: user.user_id }, { transaction: t });
        }
        return user;
    });
};
