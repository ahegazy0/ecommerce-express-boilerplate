const Joi = require("joi");

// Email verification validator
const verifyEmailSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Verification token is required",
    "any.required": "Verification token is required",
  }),
});

// Resend verification email validator
const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
});

// Forgot password validator
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
});

// Reset password validator
const resetPasswordSchema = Joi.object({
  // token: Joi.string()
  //     .required()
  //     .messages({
  //         'string.empty': 'Reset token is required',
  //         'any.required': 'Reset token is required'
  //     }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

// Change password validator
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 6 characters",
    "any.required": "New password is required",
  }),
});

// Google OAuth validator
const googleLoginSchema = Joi.object({
  googleId: Joi.string().required().messages({
    "string.empty": "Google ID is required",
    "any.required": "Google ID is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should be at least 2 characters",
    "string.max": "Name should not exceed 50 characters",
    "any.required": "Name is required",
  }),
  picture: Joi.string().uri().optional().messages({
    "string.uri": "Picture must be a valid URL",
  }),
});

module.exports = {
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  googleLoginSchema,
};
