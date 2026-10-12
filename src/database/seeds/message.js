import Message from "../models/message.js";
import { getUserId, minutesAgo } from "./helpers.js";

export const seedMessages = async () => {
    if ((await Message.count()) > 0) {
        console.log("messages already have data, skipped");
        return;
    }

    // messages are between USERS (not profiles), so we use user ids
    const eric = await getUserId("eric@therapy.com");
    const aline = await getUserId("aline@therapy.com");
    const amina = await getUserId("amina@therapy.com");

    await Message.bulkCreate([
        { sender_id: eric, receiver_id: amina, message_text: "Hello Dr Amina, thank you for the session.", sent_at: minutesAgo(60), is_read: true },
        { sender_id: amina, receiver_id: eric, message_text: "You are welcome Eric. Please keep the sleep diary.", sent_at: minutesAgo(50), is_read: true },
        { sender_id: eric, receiver_id: amina, message_text: "I will. Can we book another session next week?", sent_at: minutesAgo(40), is_read: true },
        { sender_id: amina, receiver_id: eric, message_text: "Yes, check my available times in the app.", sent_at: minutesAgo(30), is_read: false },
        { sender_id: aline, receiver_id: amina, message_text: "Hello, is tomorrow's session still on?", sent_at: minutesAgo(10), is_read: false }
    ]);
    console.log("messages seeded");
};
