const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const wrapAsync = require("../utils/catchAsync");

const createReview = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const { productId, rating, comment } = req.body;

  // Check if product exists
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check if user has purchased this product
  const hasPurchased = await Order.findOne({
    userId,
    "items.productId": productId,
    paymentStatus: "paid",
    isActive: true,
  });

  if (!hasPurchased) {
    throw new AppError("You can only review products you have purchased", 403);
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    userId,
    productId,
    isActive: true,
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this product", 400);
  }

  const review = new Review({
    userId,
    productId,
    rating,
    comment,
  });

  await review.save();

  // Update product ratings
  await updateProductRatings(productId);

  return res.jsend.success(
    {
      review,
      message: "Review created successfully",
    },
    201
  );
});

const getProductReviews = wrapAsync(async (req, res) => {
  const productId = req.params.productId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const totalReviews = await Review.countDocuments({
    productId,
    isActive: true,
  });
  const reviews = await Review.find({ productId, isActive: true })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.jsend.success({
    reviews,
    pagination: {
      total: totalReviews,
      page,
      limit,
      totalPages: Math.ceil(totalReviews / limit),
    },
  });
});

const updateReview = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const reviewId = req.params.id;
  const { rating, comment } = req.body;

  const review = await Review.findOne({
    _id: reviewId,
    userId,
    isActive: true,
  });
  if (!review) {
    throw new AppError("Review not found", 404);
  }

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;

  await review.save();

  // Update product ratings
  await updateProductRatings(review.productId);

  return res.jsend.success({
    review,
    message: "Review updated successfully",
  });
});

const deleteReview = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const reviewId = req.params.id;

  const review = await Review.findOne({
    _id: reviewId,
    userId,
    isActive: true,
  });
  if (!review) {
    throw new AppError("Review not found", 404);
  }

  review.isActive = false;
  await review.save();

  // Update product ratings
  await updateProductRatings(review.productId);

  return res.jsend.success({
    message: "Review deleted successfully",
  });
});

const getUserReviews = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalReviews = await Review.countDocuments({ userId, isActive: true });
  const reviews = await Review.find({ userId, isActive: true })
    .populate("productId", "name image price")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.jsend.success({
    reviews,
    pagination: {
      total: totalReviews,
      page,
      limit,
      totalPages: Math.ceil(totalReviews / limit),
    },
  });
});

// Helper function to update product ratings
const updateProductRatings = async (productId) => {
  const reviews = await Review.find({ productId, isActive: true });

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      "ratings.average": 0,
      "ratings.count": 0,
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    "ratings.average": Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    "ratings.count": reviews.length,
  });
};

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getUserReviews,
};
