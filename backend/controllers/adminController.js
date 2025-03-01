const User = require("../models/userSchema");
const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");

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
    if (!categoryName || !description || !discount) {
      return res.status(400).json({ message: "Enter all the fields" });
    }

    const category = await Category.findOne({ name: categoryName });

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

    const categories = await Category.find({
      name: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
      isDeleted: false, // Exclude soft-deleted categories
    }).sort({ createdAt: -1 }); // Sort by latest first

    res.json(categories);
  } catch (error) {
    console.error("Error in searchCategories:", error);
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
      discount,
      productsCount,
    } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(400).json({ message: "Category doesn't exist" });
    }

    // Update the category fields
    category.name = name;
    category.description = description;
    category.thumbnail = thumbnail;
    category.isActive = isActive;
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

const softdelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the isDeleted field instead of deleting the document
    await Category.findByIdAndUpdate(id, { isDeleted: true });

    res.status(200).json({ message: "Category soft deleted successfully" });
  } catch (error) {
    console.error("Error soft deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params; // Assuming id is passed as a URL parameter
    if (!id) {
      return res.status(400).json({ message: "Category id not available" });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category details fetching succesfull",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      productImages,
      base_price,
      discount_price,
      discount_percentage,
      stock,
      color,
      quantity,
      size,
    } = req.body;

    const newProduct = new Product({
      name,
      description,
      brand,
      productImages,
      base_price,
      discount_price,
      discount_percentage,
      stock,
      color,
      quantity,
      size,
    });

    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
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

const getProduct = async (req, res) => {
  try {
    const { id } = req.params; // Assuming id is passed as a URL parameter
    if (!id) {
      return res.status(400).json({ message: "Product id not available" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product details fetching succesfull",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const softdeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing category ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the isDeleted field instead of deleting the document
    await Product.findByIdAndUpdate(id, { isDeleted: true });

    res.status(200).json({ message: "Product soft deleted successfully" });
  } catch (error) {
    console.error("Error soft deleting Product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      brand,
      productImages,
      base_price,
      discount_price,
      discount_percentage,
      stock,
      color,
      quantity,
      size,
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({ message: "Category doesn't exist" });
    }

    // Update the category fields
    product.name = name;
    product.description = description;
    product.brand = brand;
    product.base_price = base_price;
    product.discount_price = discount_price;
    product.productImages = productImages;
    product.discount_percentage = discount_percentage;
    product.stock = stock;
    product.color = color;
    product.quantity = quantity;
    product.size = size;

    await product.save(); // Save the updated category

    res.status(200).json({ message: "product successfully updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  searchUsers,
  addCategorys,
  searchCategories,
  editCategories,
  softdelete,
  addProduct,
  getCategory,
  searchProducts,
  getProduct,
  softdeleteProduct,
  editProduct,
};
