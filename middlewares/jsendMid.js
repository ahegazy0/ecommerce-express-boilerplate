module.exports = (req, res, next) => {
  if (!res.jsend) {
    res.jsend = {
      success: (data = {}, statusCode = 200) =>
        res.status(statusCode).json({ status: "success", data }),

      fail: (data = {}, statusCode = 400) =>
        res.status(statusCode).json({ status: "fail", data }),

      error: (data = "An error occurred", statusCode = 500) =>
        res.status(statusCode).json({ status: "error", data }),
    };
  }
  next();
};
