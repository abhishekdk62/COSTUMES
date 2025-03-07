const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    thumbnail: { type: String },
    isActive: { type: Boolean, default: true }, // For enabling/disabling category
    isDeleted: { type: Boolean, default: false }, // Soft delete field
    discount: { type: Number, default: 0 }, // Discount percentage or fixed amount
    productsCount: { type: Number, default: 0 }, // Number of products in this category
    subCategories: { type: [String], default: [] },
  },
  { timestamps: true }
); // Automatically manages createdAt & updatedAt

module.exports = mongoose.model("Category", CategorySchema);
