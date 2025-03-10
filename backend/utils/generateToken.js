const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {  // Include role here
  const KEY = process.env.SECRET_KEY;
  if (!KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  return jwt.sign({ id, role }, KEY, { expiresIn: "2h" });  // Include role in payload
};

module.exports = generateToken;
