const User = require("../models/User");
const AppError = require("../utils/AppError");
const wrapAsync = require("../utils/catchAsync");
const jwt = require("../config/jwt");
// const bcrypt = require("bcrypt");
const emailService = require("../utils/emailService");

const register = wrapAsync(async (req, res) => {
  let { name, email, password, role = "user" } = req.body;

  email = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email, isActive: true });

  if (existingUser) {
    throw new AppError({ email: "User already registered." }, 400);
  }

  // Generate email verification token
  const emailVerificationToken = emailService.generateToken();
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const newUser = new User({
    name,
    email,
    password,
    role,
    emailVerificationToken,
    emailVerificationExpires,
  });

  try {
    await newUser.save();

    // Send verification email
    await emailService.sendVerificationEmail(
      email,
      emailVerificationToken,
      name
    );
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError({ email: "User already registered." }, 400);
    }
    throw new AppError(err.message, 500);
  }

  const accessToken = jwt.signToken(newUser);
  const refreshToken = jwt.refreshToken(newUser);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userResponse = newUser.toObject();
  delete userResponse.password;

  return res.jsend.success({
    user: userResponse,
    accessToken,
    message:
      "Registered successfully! Please check your email to verify your account.",
  });
});

const login = wrapAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isActive: true }).select(
    "+password"
  );

  if (!user) {
    throw new AppError("Email or password incorrect.", 400);
  }

  // Check if email is verified
  if (!user.emailVerified) {
    throw new AppError(
      "Please verify your email before logging in. Check your inbox for the verification email.",
      400
    );
  }

  const matchedPass = await user.comparePassword(password);

  if (!matchedPass) {
    throw new AppError("Incorrect password.", 400);
  }

  const accessToken = jwt.signToken(user);
  const refreshToken = jwt.refreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  return res.jsend.success({
    user: userResponse,
    message: "Logged in successfully.",
    accessToken,
  });
});

const logout = wrapAsync(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.jsend.success({ message: "Logged out successfully." });
});

// Google OAuth Login
const googleLogin = wrapAsync(async (req, res) => {
  const { googleId, email, name, picture } = req.body;

  if (!googleId || !email || !name) {
    throw new AppError("Missing required Google OAuth data", 400);
  }

  let user = await User.findOne({ email, isActive: true });

  if (!user) {
    // Create new user with Google data
    user = new User({
      name,
      email: email.toLowerCase(),
      avatar: picture,
      role: "user",
      isActive: true,
    });

    await user.save();
  } else {
    // Update existing user's avatar if needed
    if (!user.avatar && picture) {
      user.avatar = picture;
      await user.save();
    }
  }

  const accessToken = jwt.signToken(user);
  const refreshToken = jwt.refreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  return res.jsend.success({
    user: userResponse,
    accessToken,
    message: "Google login successful",
  });
});

// Get current user profile
const getProfile = wrapAsync(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return res.jsend.success({ user });
});

// Update user profile
const updateProfile = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const { name, phoneNumber, address, preferences } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Update allowed fields
  if (name) user.name = name;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (address) user.address = address;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  return res.jsend.success({
    user: userResponse,
    message: "Profile updated successfully",
  });
});

// Email Verification
const verifyEmail = wrapAsync(async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  await emailService.sendWelcomeEmail(user.email, user.name);

  return res.jsend.success({
    message: "Email verified successfully! Welcome to our platform.",
  });
});

// Resend verification email
const resendVerificationEmail = wrapAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.emailVerified) {
    throw new AppError("Email is already verified", 400);
  }

  // Generate new verification token
  const emailVerificationToken = generateToken();
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  user.emailVerificationToken = emailVerificationToken;
  user.emailVerificationExpires = emailVerificationExpires;
  await user.save();

  // Send verification email
  await sendVerificationEmail(email, emailVerificationToken, user.name);

  return res.jsend.success({
    message: "Verification email sent successfully",
  });
});

// Forgot Password
const forgotPassword = wrapAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    // Don't reveal if email exists or not for security
    return res.jsend.success({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  }

  // Generate password reset token
  const passwordResetToken = emailService.generateToken();
  const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

  user.passwordResetToken = passwordResetToken;
  user.passwordResetExpires = passwordResetExpires;
  await user.save({ validateBeforeSave: false });

  try {
    // Send password reset email
    await emailService.sendPasswordResetEmail(
      email,
      passwordResetToken,
      user.name
    );

    return res.jsend.success({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError("Error sending email. Please try again later.", 500);
  }
});

// Reset Password
const resetPassword = wrapAsync(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  // Update password
  // const hashedPassword = await bcrypt.hash(password, 10);
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Generate new JWT tokens
  const accessToken = jwt.signToken(user);
  const refreshToken = jwt.refreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  return res.jsend.success({
    user: userResponse,
    accessToken,
    message: "Password reset successfully",
  });
});

// Change Password (for logged-in users)
const changePassword = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", 400);
  }

  // Update password
  // const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = newPassword;
  await user.save();

  return res.jsend.success({
    message: "Password changed successfully",
  });
});

module.exports = {
  register,
  login,
  logout,
  googleLogin,
  getProfile,
  updateProfile,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};
