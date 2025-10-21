const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should be at least 3 characters",
    "string.max": "Name should not exceed 100 characters",
  }),

  description: Joi.string().trim().max(1000).required().messages({
    "string.empty": "Product description is required",
    "string.max": "Description should not exceed 1000 characters",
  }),

  category: Joi.string().trim().required().messages({
    "string.empty": "Category is required",
  }),

  // 'images' are handled by multer, optional validation if URLs are submitted manually
  images: Joi.array().items(Joi.string().uri()).optional(),

  price: Joi.number().required().min(0).messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),

  originalPrice: Joi.number().min(0).optional().messages({
    "number.base": "Original price must be a number",
    "number.min": "Original price cannot be negative",
  }),

  stock: Joi.number().required().min(0).messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be negative",
    "any.required": "Stock is required",
  }),

  brand: Joi.string().trim().optional(),

  features: Joi.alternatives()
    .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
    .optional(),

  tags: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().trim().lowercase()),
      Joi.string().trim()
    )
    .optional(),

  isFeatured: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),

  ratings: Joi.object({
    average: Joi.number().min(0).max(5).optional(),
    count: Joi.number().min(0).optional(),
  }).optional(),
});
const prodUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().max(1000),
  category: Joi.string(),
  price: Joi.number().min(0),
  originalPrice: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  images: Joi.array().items(Joi.string().uri()).optional(),
  brand: Joi.string(),
  features: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
  isFeatured: Joi.boolean(),
}).min(1);

module.exports = {
  productSchema,
  prodUpdateSchema,
};
