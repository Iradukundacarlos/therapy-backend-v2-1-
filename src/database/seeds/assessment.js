import Assessment from "../models/assessment.js";
import { getClientId } from "./helpers.js";

export const seedAssessments = async () => {
    if ((await Assessment.count()) > 0) {
        console.log("assessments already have data, skipped");
        return;
    }

    await Assessment.bulkCreate([
        { client_id: await getClientId("eric@therapy.com"), main_concern: "Constant anxiety and trouble sleeping", preferred_therapy: "CBT", preferred_language: "English", preferred_time: "Morning", completed_at: new Date() },
        { client_id: await getClientId("aline@therapy.com"), main_concern: "Stress and burnout at work", preferred_therapy: "Mindfulness", preferred_language: "Kinyarwanda", preferred_time: "Afternoon", completed_at: new Date() },
        { client_id: await getClientId("patrick@therapy.com"), main_concern: "Difficulties in my relationship", preferred_therapy: "Couples therapy", preferred_language: "French", preferred_time: "Evening", completed_at: new Date() },
        { client_id: await getClientId("diane@therapy.com"), main_concern: "Low mood and loss of motivation", preferred_therapy: "Talk therapy", preferred_language: "English", preferred_time: "Morning", completed_at: new Date() }
    ]);
    console.log("assessments seeded");
};
