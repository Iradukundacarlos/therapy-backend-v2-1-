// ============================================
// LIST OF ENDPOINTS FOR THE SWAGGER PAGE
// ============================================
// One line per endpoint:  [method, url, tag, summary, needsToken, exampleBody]
// swagger.js turns this list into the interactive page at /docs.
// When you add a new route, add one line here.

const endpoints = [
    // ---------- Auth ----------
    ["post", "/api/register", "Auth", "Register a client or therapist", false,
        { first_name: "Eric", last_name: "Ishimwe", email: "eric.new@therapy.com", password: "Test123", phone: "+250788000099", role: "client" }],
    ["post", "/api/login", "Auth", "Login and receive a token", false,
        { email: "eric@therapy.com", password: "Test123" }],
    ["get", "/api/me", "Auth", "Who am I (uses the token)", true],

    // ---------- Users ----------
    ["get", "/api/getAllUsers", "Users", "All users (admin)", true],
    ["get", "/api/getUser/:id", "Users", "One user (himself or admin)", true],
    ["post", "/api/createUser", "Users", "Create any user (admin)", true,
        { first_name: "New", last_name: "Admin", email: "admin2@therapy.com", password: "Test123", role: "admin" }],
    ["put", "/api/updateUser/:id", "Users", "Update name, phone or password", true,
        { first_name: "Eric", last_name: "Ishimwe", phone: "+250788000020" }],
    ["put", "/api/updateUserStatus/:id", "Users", "Set active / suspended / banned (admin)", true,
        { status: "suspended" }],
    ["delete", "/api/deleteUser/:id", "Users", "Delete a user (admin)", true],

    // ---------- Therapists ----------
    ["get", "/api/getAllTherapists", "Therapists", "List therapists (clients see verified only)", true],
    ["get", "/api/getTherapist/:id", "Therapists", "One therapist with average rating", true],
    ["get", "/api/getMyTherapistProfile", "Therapists", "My therapist profile", true],
    ["put", "/api/updateMyTherapistProfile", "Therapists", "Update my therapist profile", true,
        { specialization: "Anxiety", experience_years: 7, bio: "I help people manage anxiety." }],
    ["put", "/api/verifyTherapist/:id", "Therapists", "Verify or reject a therapist (admin)", true,
        { verification_status: "verified" }],

    // ---------- Clients ----------
    ["get", "/api/getAllClients", "Clients", "All clients (admin)", true],
    ["get", "/api/getMyClientProfile", "Clients", "My client profile", true],
    ["put", "/api/updateMyClientProfile", "Clients", "Update my client profile", true,
        { date_of_birth: "1998-05-14", gender: "male", preferred_language: "English" }],

    // ---------- Administrators ----------
    ["get", "/api/getAllAdministrators", "Administrators", "All administrators (admin)", true],

    // ---------- Availability ----------
    ["post", "/api/createAvailability", "Availability", "Add a time slot (therapist)", true,
        { available_date: "2030-01-15", start_time: "10:00", end_time: "11:00" }],
    ["get", "/api/getMyAvailability", "Availability", "My slots (therapist)", true],
    ["get", "/api/getTherapistAvailability/:therapistId", "Availability", "Open future slots of a therapist", true],
    ["put", "/api/updateAvailability/:id", "Availability", "Change an open slot (therapist)", true,
        { start_time: "11:00", end_time: "12:00" }],
    ["delete", "/api/deleteAvailability/:id", "Availability", "Delete an open slot (therapist)", true],

    // ---------- Appointments ----------
    ["post", "/api/bookAppointment", "Appointments", "Book an open slot (client)", true,
        { availability_id: 1, reason: "Feeling anxious lately" }],
    ["get", "/api/getMyAppointments", "Appointments", "My appointments (admin: all)", true],
    ["get", "/api/getAppointment/:id", "Appointments", "One appointment", true],
    ["put", "/api/updateAppointmentStatus/:id", "Appointments", "confirmed / cancelled / completed", true,
        { status: "confirmed" }],

    // ---------- Sessions ----------
    ["post", "/api/createSession", "Sessions", "Create a session for a confirmed appointment (therapist)", true,
        { appointment_id: 1, session_type: "video", meeting_link: "https://meet.example.com/abc123" }],
    ["get", "/api/getSession/:id", "Sessions", "One session", true],
    ["put", "/api/startSession/:id", "Sessions", "Start a session (therapist)", true],
    ["put", "/api/endSession/:id", "Sessions", "End a session (therapist)", true],

    // ---------- Session notes ----------
    ["post", "/api/addSessionNote/:sessionId", "Session notes", "Add a private note (therapist)", true,
        { note_content: "Client reported poor sleep." }],
    ["get", "/api/getSessionNotes/:sessionId", "Session notes", "Notes of a session (therapist)", true],
    ["put", "/api/updateSessionNote/:id", "Session notes", "Edit a note (therapist)", true,
        { note_content: "Updated note text." }],
    ["delete", "/api/deleteSessionNote/:id", "Session notes", "Delete a note (therapist)", true],

    // ---------- Feedback ----------
    ["post", "/api/addFeedback/:sessionId", "Feedback", "Rate a session 1 to 5 (client)", true,
        { rating: 5, comment: "Very helpful and kind." }],
    ["get", "/api/getSessionFeedback/:sessionId", "Feedback", "Feedback of a session", true],
    ["get", "/api/getTherapistFeedback/:therapistId", "Feedback", "All feedback of a therapist + average", true],

    // ---------- Assessments ----------
    ["post", "/api/createAssessment", "Assessments", "Fill in the assessment (client)", true,
        { main_concern: "Constant anxiety", preferred_therapy: "CBT", preferred_language: "English", preferred_time: "Morning" }],
    ["get", "/api/getMyAssessments", "Assessments", "My assessments (client)", true],

    // ---------- Messages ----------
    ["post", "/api/sendMessage", "Messages", "Send a message to a user", true,
        { receiver_id: 2, message_text: "Hello, can we move our session?" }],
    ["get", "/api/getInbox", "Messages", "Messages I received", true],
    ["get", "/api/getConversation/:otherUserId", "Messages", "Conversation with another user", true],
    ["put", "/api/markMessageRead/:id", "Messages", "Mark a message as read", true],

    // ---------- Notifications ----------
    ["get", "/api/getMyNotifications", "Notifications", "My notifications", true],
    ["put", "/api/markAllNotificationsRead", "Notifications", "Mark all as read", true],
    ["put", "/api/markNotificationRead/:id", "Notifications", "Mark one as read", true],

    // ---------- Reports ----------
    ["post", "/api/createReport", "Reports", "Report a user", true,
        { reported_user_id: 3, subject: "Test report", description: "Testing the report feature" }],
    ["get", "/api/getMyReports", "Reports", "Reports I sent", true],
    ["get", "/api/getAllReports", "Reports", "All reports (admin)", true],
    ["put", "/api/updateReportStatus/:id", "Reports", "open / in_review / resolved (admin)", true,
        { status: "resolved" }]
];

export default endpoints;
