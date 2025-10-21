const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const reviewController = require("../controllers/review");
const validate = require("../middlewares/validate");
const objectIdSchema = require("../validators/objectIdValid");
const reviewValidator = require("../validators/reviewValid");

// Review Routes
router.get(
  "/my-reviews",
  auth.authenticateToken,
  reviewController.getUserReviews
);
router.get(
  "/product/:productId",
  validate(objectIdSchema("productId"), "params"),
  reviewController.getProductReviews
);
router.post(
  "/",
  auth.authenticateToken,
  validate(reviewValidator.reviewSchema),
  reviewController.createReview
);
router.patch(
  "/:id",
  auth.authenticateToken,
  validate(objectIdSchema(), "params"),
  validate(reviewValidator.reviewUpdateSchema),
  reviewController.updateReview
);
router.delete(
  "/:id",
  auth.authenticateToken,
  validate(objectIdSchema(), "params"),
  reviewController.deleteReview
);

module.exports = router;
