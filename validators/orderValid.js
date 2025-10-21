const Joi = require("joi");

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message("Invalid ObjectId");

const itemSchema = Joi.object({
  productId: objectId.required().messages({
    "any.required": "Product ID is required",
    "string.pattern.base": "Invalid Product ID",
  }),
  quantity: Joi.number().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  image: Joi.string().optional(),
});

const orderSchema = Joi.object({
  userId: objectId.required().messages({
    "any.required": "User ID is required",
    "string.pattern.base": "Invalid User ID format",
  }),
  cartId: objectId.required().messages({
    "any.required": "Cart ID is required",
  }),
  items: Joi.array().items(itemSchema).min(1).required().messages({
    "array.base": "Items must be an array",
    "array.min": "At least one item is required",
    "any.required": "Order items are required",
  }),
  subtotal: Joi.number().min(0).required(),
  tax: Joi.number().min(0).default(0),
  shipping: Joi.number().min(0).default(0),
  totalPrice: Joi.number().min(0).required().messages({
    "number.base": "Total Price must be a number",
    "number.min": "Total Price cannot be negative",
    "any.required": "Total price is required",
  }),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default("US"),
    phone: Joi.string().optional(),
  }).required(),
  billingAddress: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    country: Joi.string().default("US"),
  }).optional(),
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .default("pending"),
  paymentStatus: Joi.string()
    .valid("pending", "paid", "failed")
    .default("pending"),
  paymentMethod: Joi.string()
    .valid("credit_card", "debit_card", "paypal", "stripe")
    .default("credit_card"),
  paymentId: Joi.string().optional(),
  notes: Joi.string().max(500).optional(),
});

module.exports = orderSchema;
