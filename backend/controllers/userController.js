const User = require("../models/userSchema");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { email,name,phone, password,  } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email,firstname:name,phone, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { signup };
