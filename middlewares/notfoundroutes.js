module.exports = (req, res, next) => {
  return res.jsend.fail({ message: "Page Not Found . ." }, 404);
};
