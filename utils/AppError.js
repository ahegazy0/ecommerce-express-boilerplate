class AppError extends Error {
  constructor(message, statusCode) {
    if (typeof message === "object") {
      super("Validation failed");
      this.data = message;
    } else {
      super(message);
    }

    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
