const jwt = require("jsonwebtoken");
const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.cookies.token; // Get token from cookie
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const verified = jwt.verify(token, "your_secret_key"); // Verify JWT
      req.user = verified; // Attach user info to request
      // ✅ Check if the user's role is in the allowedRoles array
      if (allowedRoles.length > 0 && !allowedRoles.includes(verified.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next(); // ✅ Continue to the route
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };
};
module.exports = authMiddleware;
