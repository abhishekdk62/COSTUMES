const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,  // Ensure every review is linked to a product
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  // Ensure every review is linked to a user
    },
    rating: {
      type: Number,
      required: true,
      min: 1,  // At least 1 star
      max: 5,  // Max 5 stars
    },
    comment: {
      type: String,
      required: true,  // Ensure a review has some text
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
