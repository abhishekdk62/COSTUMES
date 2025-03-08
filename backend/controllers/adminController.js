const User = require("../models/userSchema");
const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");
const { default: mongoose } = require("mongoose");

const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = {
      firstname: { $regex: searchQuery, $options: "i" },
    };

    // Count total matching users
    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Retrieve paginated users (excluding the password field)
    const users = await User.find(filter, "-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      users,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in searchUsers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addCategorys = async (req, res) => {
  try {
    const { categoryName, description, discount, thumbnail, subCategories } =
      req.body;

    // Validate required fields
    if (!categoryName || !description || !discount || !thumbnail) {
      return res
        .status(400)
        .json({ message: "Enter all the fields including thumbnail" });
    }

    // Check if the category already exists
    const category = await Category.findOne({ name: categoryName });
    if (category) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create a new category with the thumbnail URL included
    const newCategory = new Category({
      name: categoryName,
      description,
      discount,
      thumbnail,
      subCategories,
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
const filteredProducts = async (req, res) => {
  try {
    const { searchTerm, category, minPrice, maxPrice, sortBy } = req.body;

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

    let sortOptions = {};
    if (sortBy === "priceAsc") sortOptions.discount_price = 1;
    if (sortBy === "priceDesc") sortOptions.discount_price = -1;
    if (sortBy === "nameAsc") sortOptions.name = 1;
    if (sortBy === "nameDesc") sortOptions.name = -1;

    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const searchCategories = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Build the filter object
    const filter = {
      name: { $regex: searchQuery, $options: "i" },
      isDeleted: false, // Only active categories
    };

    // Count the total number of matching documents
    const total = await Category.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Retrieve the categories with pagination
    const categories = await Category.find(filter)
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      categories,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in searchCategories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const searchDeletedCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isDeleted: true, // Exclude soft-deleted categories
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
      subCategories,
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
    category.subCategories = subCategories;
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
      category,
      subCategory,
      owner,
      variants, // variants: [{ color, size, stock, base_price, discount_price, discount_percentage }]
    } = req.body;

    // Calculate discount_percentage for each variant
    const updatedVariants = variants.map(variant => {
      let discount_percentage = 0;
      if (variant.base_price && variant.base_price !== 0 && variant.discount_price != null) {
        discount_percentage = ((variant.base_price - variant.discount_price) / variant.base_price) * 100;
      }
      return { ...variant, discount_percentage };
    });

    const newProduct = new Product({
      name,
      description,
      brand,
      category,
      subCategory,
      owner,
      variants: updatedVariants,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};




const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = {
      name: { $regex: searchQuery, $options: "i" },
      isDeleted: false,
    };

    // Count total matching products
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Retrieve paginated products
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      products,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const searchDeletedProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";

    const products = await Product.find({
      name: { $regex: searchQuery, $options: "i" },
      isDeleted: true,
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
    const product = await Product.findById(id).populate("category");

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
      subCategory,
      brand,
      owner,
      category,
     variants
    } = req.body;

    const updatedVariants = variants.map(variant => {
      let discount_percentage = 0;
      if (variant.base_price && variant.base_price !== 0 && variant.discount_price != null) {
        discount_percentage = ((variant.base_price - variant.discount_price) / variant.base_price) * 100;
      }
      return { ...variant, discount_percentage };
    });


    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({ message: "Product doesn't exist" });
    }

    // Update the product fields
    product.name = name;
    product.description = description;
    product.brand = brand;
    product.owner=owner;
    product.subCategory = subCategory;
    product.category = category;
    product.variants= updatedVariants,

    await product.save(); // Ensure saving completes before responding

    res.status(200).json({ message: "Product successfully updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const restoreProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json("Id not found");
    }
    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    res.status(200).json("Product updated");
  } catch (error) {
    res.status(500).json("Internal server error", error);
  }
};

const restoreCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "category id not available" });
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    res.status(200).json({ message: "Category updated from backend" });
  } catch (error) {
    res.status(500).json({ "error is": error });
  }
};

module.exports = {
  searchUsers,
  restoreProduct,
  addCategorys,
  searchCategories,
  searchDeletedCategories,
  editCategories,
  softdelete,
  addProduct,
  getCategory,
  searchProducts,
  filteredProducts,
  getProduct,
  restoreCategory,
  searchDeletedProducts,
  softdeleteProduct,
  editProduct,
};
