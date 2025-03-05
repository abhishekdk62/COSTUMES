const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library"); // Added for verifying Google token
const client = new OAuth2Client(process.env.CLIENT_ID); // Initialize using CLIENT_ID from .env
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Review = require("../models/reviewSchema");
const { log } = require("console");

const signup = async (req, res) => {
  try {
    const { email, name, phone, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      firstname: name,
      phone,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email not found. Please sign up first." });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999);
    const otpExpiry = Date.now() + 5 * 60 * 1000; // Expiry time (5 minutes from now)

    // Store OTP and expiry time in the database
    await User.findOneAndUpdate({ email }, { otp, otpExpiry }, { new: true });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

// OTP Verification with Expiry Check
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (Date.now() > user.otpExpiry) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful verification
    await User.findOneAndUpdate(
      { email },
      { $unset: { otp: 1, otpExpiry: 1 } }
    );

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

const getNewArrivals = async (req, res) => {
  try {
    // Fetch the 4 most recent products
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      data: newArrivals,
      message: "New arrivals fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching new arrivals",
      error: error.message,
    });
  }
};

const categoryWiseProducs = async (req, res) => {
  try {
    const { catName } = req.body;
    const trimmedCatName = catName.trim();
    // Allow any whitespace after the trimmed string:
    const regex = new RegExp(`^${trimmedCatName}\\s*$`, "i");
    const category = await Category.findOne({ name: regex });

    if (!category) {
      return res.status(400).json({ message: `${catName} Category Not found from backend` });
    }

    const prods = await Product.find({ category: category._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: prods,
      message: `${catName} collections fetched successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error fetching ${catName} collections`,
      error: error.message,
    });
  }
};

const getSimilarProducts = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const prods = await Product.find({ category: categoryId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: prods,
      message: `collections fetched successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error fetching collections`,
      error: error.message,
    });
  }
};

const filteredProducts = async (req, res) => {
  try {
    const { searchTerm, category, minPrice, maxPrice, sortBy, page, limit } = req.body;

    // Set default pagination values if not provided
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 10;

    // Build query based on filters
    let query = {};
    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      query.category = category;
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
      query.discount_price = { $gte: minPrice, $lte: maxPrice };
    }

    // Build sort options based on sortBy
    let sortOptions = {};
    if (sortBy === "priceAsc") sortOptions.discount_price = 1;
    if (sortBy === "priceDesc") sortOptions.discount_price = -1;
    if (sortBy === "nameAsc") sortOptions.name = 1;
    if (sortBy === "nameDesc") sortOptions.name = -1;

    // Count total matching documents
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / perPage);

    // Retrieve paginated products
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      products,
      total,
      page: currentPage,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};


const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";

    const products = await Product.find({
      name: { $regex: searchQuery, $options: "i" },
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error in searchproducts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { email },
      { password: hashedPassword, otp: null, otpExpiry: null }
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};
const addReview = async (req, res) => {
  try {
    const { newReview, productId, userId } = req.body;
    if (
      newReview.text == null ||
      newReview.rating == null ||
      productId == null ||
      userId == null
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newData = new Review({
      productId,
      userId,
      rating: newReview.rating,
      comment: newReview.text,
    });

    await newData.save();
    res.status(200).json({ message: "Review added succesfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Adding review", error: error.message });
  }
};
const getReview = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product id not availabke" });
    }
    const reviews = await Review.find({ productId }).populate("userId");

    res.status(200).json({ data: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};
const searchCategoriesToFilter = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";

    const categories = await Category.find({
      name: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
      isDeleted: false, // Exclude soft-deleted categories
    }).sort({ createdAt: -1 }); // Sort by latest first

    res.json(categories);
  } catch (error) {
    console.error("Error in searchCategories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  getSimilarProducts,
  signup,
  filteredProducts,
  sendOTP,
  verifyOTP,
  addReview,
  getReview,
  searchCategoriesToFilter,
  getNewArrivals,
  searchProducts,
  resetPassword,
  categoryWiseProducs,
};
