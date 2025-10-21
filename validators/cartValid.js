const Joi = require("joi");
const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message("Invalid ObjectId");

const cartItemSchema = Joi.object({
  productId: objectId.required().messages({
    "string.empty": "Product ID is required",
    "string.pattern.base": "Invalid Product ID",
  }),
  quantity: Joi.number().min(1).max(99).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "number.max": "Quantity cannot exceed 99",
    "any.required": "Quantity is required",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
});

const cartSchema = Joi.object({
  userId: objectId.required().messages({
    "string.empty": "User ID is required",
    "string.pattern.base": "Invalid User ID",
  }),
  items: Joi.array().items(cartItemSchema).required().messages({
    "array.base": "Items must be an array",
    "any.required": "Items are required",
  }),
  subtotal: Joi.number().min(0).default(0),
  shipping: Joi.number().min(0).default(0),
  tax: Joi.number().min(0).default(0),
  totalPrice: Joi.number().min(0).default(0),
});

const addToCartSchema = Joi.object({
  productId: objectId.required().messages({
    "string.empty": "Product ID is required",
    "string.pattern.base": "Invalid Product ID",
  }),
  quantity: Joi.number().min(1).max(99).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "number.max": "Quantity cannot exceed 99",
    "any.required": "Quantity is required",
  }),
});

module.exports = {
  cartSchema,
  cartItemSchema,
  addToCartSchema,
};
