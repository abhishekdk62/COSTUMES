const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    couponName:{
      type:String,
      required:true,
    },
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"], // percentage: e.g., 10% off; fixed: e.g., $10 off
    },
    discountValue: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 1, // number of times the coupon can be used
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
