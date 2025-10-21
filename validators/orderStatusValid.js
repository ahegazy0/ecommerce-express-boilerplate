const Joi = require("joi");

const orderUpdateSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .optional(),
  paymentStatus: Joi.string().valid("pending", "paid", "failed").optional(),
  trackingNumber: Joi.string().optional(),
  notes: Joi.string().max(500).optional(),
}).min(1);

module.exports = orderUpdateSchema;
