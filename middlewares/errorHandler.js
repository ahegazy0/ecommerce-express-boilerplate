const AppError = require("../utils/AppError");

module.exports = (err, req, res, next) => {
  // console.error("Error : ", err);

  if (!(err instanceof AppError)) {
    err = new AppError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }

  if (!err.isOperational) {
    err.message = "Something went wrong!";
  }

  const payload = err.data || { message: err.message };
  if (res.jsend) {
    if (err.status === "fail") {
      return res.jsend.fail(payload, err.statusCode);
    }
    return res.jsend.error(payload, err.statusCode);
  }

  // 🔒 fallback when jsend is not attached (e.g., Stripe webhook)
  return res.status(err.statusCode).json({
    status: err.status || "error",
    data: payload,
  });
};
