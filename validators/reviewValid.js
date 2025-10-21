const Joi = require("joi");

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message("Invalid ObjectId");

const reviewSchema = Joi.object({
  userId: objectId.required().messages({
    "any.required": "User ID is required",
    "string.pattern.base": "Invalid User ID format",
  }),
  productId: objectId.required().messages({
    "any.required": "Product ID is required",
    "string.pattern.base": "Invalid Product ID format",
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
    "any.required": "Rating is required",
  }),
  comment: Joi.string().min(10).max(500).required().messages({
    "string.empty": "Comment is required",
    "string.min": "Comment must be at least 10 characters",
    "string.max": "Comment must not exceed 500 characters",
    "any.required": "Comment is required",
  }),
});

const reviewUpdateSchema = Joi.object({
  rating: Joi.number().min(1).max(5),
  comment: Joi.string().min(10).max(500),
}).min(1);

module.exports = {
  reviewSchema,
  reviewUpdateSchema,
};
