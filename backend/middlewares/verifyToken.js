const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET_KEY // Store this in .env in production

const adminAuth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token, SECRET);
    req.admin = verified; // Attach admin details to request
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

module.exports = adminAuth;
