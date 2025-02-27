const jwt = require("jsonwebtoken"); // Correct package

const generateToken = (id) => {
  const KEY = process.env.SECRET_KEY;
  if (!KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  return jwt.sign({ id }, KEY, { expiresIn: "2h" });
};

module.exports = generateToken;
