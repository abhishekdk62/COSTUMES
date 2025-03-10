const jwt = require("jsonwebtoken");

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.cookies?.token; // Use optional chaining to avoid errors
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY); // Verify JWT
      req.user = verified; // Attach user info to request
console.log();

      // ✅ Role-based access control
      if (allowedRoles.length > 0 && !allowedRoles.includes(verified.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next(); // ✅ Continue to the next middleware
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
