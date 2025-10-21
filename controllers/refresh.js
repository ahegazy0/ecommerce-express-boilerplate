const User = require("../models/User");

const { verifyRefreshToken, signToken } = require("../config/jwt");

const AppError = require("../utils/AppError");

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new AppError("Refresh token required", 401);
  }

  try {
    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).lean();

    const newAccessToken = signToken(user); // full user payload from refresh token

    return res.jsend.success({ accessToken: newAccessToken });
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 403);
  }
};
module.exports = refreshToken;
