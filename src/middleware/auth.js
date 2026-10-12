// ============================================
// AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// ============================================
// A middleware runs BETWEEN the request arriving and the controller running.
// It can check things, stop the request, or call next() to continue.
//   req  = the incoming request
//   res  = the response we send back
//   next = "I am happy, continue to the next step"

import jwt from "jsonwebtoken";

// PROTECT: "is this person logged in?"
// Reads the token from the header   Authorization: Bearer <token>
export const Protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // ?. (optional chaining) = do not crash if the header is missing
    if (!authHeader?.startsWith("Bearer "))
        return res.status(401).json({ message: "No token provided" });

    // "Bearer abc.def.ghi" -> split on the space -> [ "Bearer", "abc.def.ghi" ]
    const token = authHeader.split(" ")[1];
    try {
        // jwt.verify() decodes the token with our secret. Wrong or expired -> error.
        // The decoded data { user_id, role, ... } is saved in req.user for the controllers.
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ message: "invalid or expired token" });
    }
};

// ALLOWED ROLES: "is this person allowed to do this?"
// A function that returns a middleware. Example: AllowedRoles("admin", "therapist")
export const AllowedRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role))
        return res.status(403).json({ message: "access denied" }); // 403 = Forbidden
    next();
};
