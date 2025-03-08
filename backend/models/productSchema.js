const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    base_price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: String, required: true }, 
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    variants: [
      {
        color: { type: String, required: true },
        productImages: { type: [String], required: true },
        size: [
          {
            size: { type: String, required: true },
            stock: { type: Number, required: true },
            base_price: { type: Number, required: true },
            discount_price: { type: Number, required: true },
            discount_percentage: { type: Number, required: true },
          },
        ],
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
