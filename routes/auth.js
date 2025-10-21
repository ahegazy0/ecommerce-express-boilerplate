const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const refreshToken = require("../controllers/refresh");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const registerSchema = require("../validators/registerValid");
const loginSchema = require("../validators/loginValid");
const authValidators = require("../validators/authValid");

// Auth Routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/google-login",
  validate(authValidators.googleLoginSchema),
  authController.googleLogin
);
router.post("/refresh", refreshToken);
router.post("/logout", authController.logout);

// Email Verification Routes
router.post(
  "/verify-email",
  validate(authValidators.verifyEmailSchema),
  authController.verifyEmail
);
router.post(
  "/resend-verification",
  validate(authValidators.resendVerificationSchema),
  authController.resendVerificationEmail
);

// Password Reset Routes
router.post(
  "/forgot-password",
  validate(authValidators.forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(authValidators.resetPasswordSchema),
  authController.resetPassword
);

// Profile Routes
router.get("/profile", auth.authenticateToken, authController.getProfile);
router.patch("/profile", auth.authenticateToken, authController.updateProfile);
router.patch(
  "/change-password",
  auth.authenticateToken,
  validate(authValidators.changePasswordSchema),
  authController.changePassword
);

module.exports = router;
