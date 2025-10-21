const Order = require("../../models/Order");
const wrapAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");

const getAllOrders = wrapAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.userId) {
    filter.userId = req.query.userId;
  }

  const totalOrders = await Order.countDocuments(filter);

  const orders = await Order.find({ ...filter, isActive: true })
    .populate("userId", "name email")
    .populate("items", "name price")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return res.jsend.success({
    orders,
    pagination: {
      total: totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
    },
  });
});

const getSingleOrder = wrapAsync(async (req, res) => {
  const orderId = req.query.orderId;

  const order = await Order.findOne({ _id: orderId, isActive: true })
    .populate("userId", "name email")
    .populate("items.productId", "name price")
    .lean();

  if (!order) {
    throw new AppError("Order not found.", 400);
  }

  res.jsend.success({ order });
});

const updateOrder = wrapAsync(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const order = await Order.findOne({ _id: orderId, isActive: true });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  if (order.paymentStatus === "paid" && status === "cancelled") {
    throw new AppError("Order cannot be cancelled after payment", 400);
  }

  const allowedStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid order status.", 400);
  }

  order.status = status;
  await order.save();

  return res.jsend.success({
    message: "Order status updated successfully.",
    data: order,
  });
});

const deleteOrder = wrapAsync(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { isActive: false },
    { new: true }
  );

  if (!order) {
    throw new AppError("OrderID not found.", 400);
  }
  res.jsend.success({ message: "Order deleted successfully" });
});

module.exports = {
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
