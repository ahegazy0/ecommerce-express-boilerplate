const mongoose = require("mongoose");

const Review = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
Review.index({ productId: 1, isActive: 1 });
Review.index({ userId: 1 });
Review.index({ rating: 1 });
Review.index({ createdAt: -1 });

// Virtual for user info
Review.virtual("userInfo", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
  options: { select: "name avatar" },
});

module.exports = mongoose.model("Review", Review, "reviews");
