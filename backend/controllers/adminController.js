const User = require("../models/userSchema");
const Category = require("../models/categorySchema");

const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";

    const users = await User.find(
      { firstname: { $regex: searchQuery, $options: "i" } }, // Search query
      "-password" // Exclude passwords
    ).sort({ createdAt: -1 }); // Sort by latest first

    res.json(users);
  } catch (error) {
    console.error("Error in searchUsers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addCategorys = async (req, res) => {
  try {
    const { categoryName, description, discount } = req.body;
    if(!categoryName||!description||!discount)
    {
      return res.status(400).json({message:"Enter all the fields"})
    }

    const category = await Category.findOne({ name:categoryName });

    if (category) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      name: categoryName,
      description,
      discount,
    });
    await newCategory.save(); // Ensure saving completes before responding
    res
      .status(201)
      .json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const searchCategories = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";

    const category = await Category.find(
      { name: { $regex: searchQuery, $options: "i" } } // Search query
    ).sort({ createdAt: -1 }); // Sort by latest first

    res.json(category);
  } catch (error) {
    console.error("Error in searchUsers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const editCategories = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      thumbnail,
      isActive,
      isDeleted,
      discount,
      productsCount,
    } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(400).json({ message: "Category doesn't exist" });
    }

    // Update the category fields
    category.description = description;
    category.thumbnail = thumbnail;
    category.isActive = isActive;
    category.isDeleted = isDeleted;
    category.discount = discount;
    category.productsCount = productsCount;

    await category.save(); // Save the updated category

    res
      .status(200)
      .json({ message: "Category successfully updated", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  searchUsers,
  addCategorys,
  searchCategories,
  editCategories,
};
