import Therapist from "../models/therapist.js";
import { getUserId } from "./helpers.js";

export const seedTherapists = async () => {
    const therapists = [
        {
            user_id: await getUserId("amina@therapy.com"),
            license_number: "RW-PSY-1001",
            specialization: "Anxiety and stress",
            qualifications: "MSc Clinical Psychology",
            experience_years: 6,
            bio: "I help people manage anxiety, stress and sleep problems using CBT.",
            verification_status: "verified"
        },
        {
            user_id: await getUserId("jean@therapy.com"),
            license_number: "RW-PSY-1002",
            specialization: "Relationships and family",
            qualifications: "MA Counselling Psychology",
            experience_years: 9,
            bio: "I support couples and families through hard conversations.",
            verification_status: "verified"
        },
        {
            user_id: await getUserId("grace@therapy.com"),
            license_number: "RW-PSY-1003",
            specialization: "Trauma recovery",
            qualifications: "BSc Psychology",
            experience_years: 2,
            bio: "Newly registered therapist waiting for admin verification.",
            verification_status: "pending" // clients cannot see this therapist until an admin verifies
        }
    ];
    await Therapist.bulkCreate(therapists, { ignoreDuplicates: true });
    console.log("therapists seeded");
};
