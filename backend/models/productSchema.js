const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    productImages: { type: [String] }, // Array of image URLs
    base_price: { type: Number, required: true },
    discount_price: { type: Number },
    discount_percentage: { type: Number },
    stock: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: String }, // New field to store the subcategory as a string
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    color: { type: String },
    isDeleted: { type: Boolean, default: false },
    size: { type: String },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Product", productSchema);
 