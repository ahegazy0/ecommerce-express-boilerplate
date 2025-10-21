const Joi = require("joi");

module.exports = (key = "id") =>
  Joi.object({
    [key]: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": `Invalid ${key} format`,
        "any.required": `${key} is required`,
      }),
  });
