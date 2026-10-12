import Report from "../models/report.js";
import { getUserId } from "./helpers.js";

export const seedReports = async () => {
    if ((await Report.count()) > 0) {
        console.log("reports already have data, skipped");
        return;
    }

    const jean = await getUserId("jean@therapy.com");
    const diane = await getUserId("diane@therapy.com");
    const patrick = await getUserId("patrick@therapy.com");
    const aline = await getUserId("aline@therapy.com");

    await Report.bulkCreate([
        { reporter_id: jean, reported_user_id: diane, subject: "Missed appointment", description: "Client cancelled very late without notice.", status: "open" },
        { reporter_id: aline, reported_user_id: patrick, subject: "Rude message", description: "Received a rude message in the chat.", status: "resolved", resolved_at: new Date() }
    ]);
    console.log("reports seeded");
};
