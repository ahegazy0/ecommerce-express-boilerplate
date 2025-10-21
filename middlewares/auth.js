const { verifyAccessToken } = require("../config/jwt");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.jsend.fail({ message: "Access token missing" }, 401);
  }

  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.jsend.fail({ message: "Invalid or expired token" }, 403);
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.jsend.fail(
        { message: "Forbidden: Insufficient permissions" },
        403
      );
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles,
};
