const User = require("../../models/User");
const wrapAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");

const getAllUsers = wrapAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.role) {
    filter.role = req.query.role;
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const totalUsers = await User.countDocuments(filter);

  const users = await User.find({ ...filter, isActive: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-password")
    .lean();

  return res.jsend.success({
    data: users,
    pagination: {
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    },
  });
});

const getSingleUser = wrapAsync(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findOne({ _id: userId, isActive: true })
    .select("-password")
    .lean();

  if (!user) {
    throw new AppError("User not found.", 400);
  }

  res.jsend.success({ data: user });
});

const deleteUser = wrapAsync(async (req, res) => {
  const userId = req.params.id;

  if (req.user.id.toString() === userId.toString()) {
    throw new AppError(
      "Admins cannot delete their own account for security reasons.",
      403
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    throw new AppError("User not found.", 400);
  }
  res.jsend.success({ message: "User deleted successfully" });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  deleteUser,
};
