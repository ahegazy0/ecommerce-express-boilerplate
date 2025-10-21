const Cart = require("../models/Cart");
const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const wrapAsync = require("../utils/catchAsync");

const makeOrder = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, billingAddress } = req.body;

  const cart = await Cart.findOne({ userId, isActive: true }).populate(
    "items.productId"
  );

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty or not found.", 404);
  }

  const validatedItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = item.productId;

    if (!product || !product.isActive) {
      throw new AppError(
        `Product ${item.productId} not found or inactive.`,
        404
      );
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        400
      );
    }

    validatedItems.push({
      productId: product._id,
      quantity: item.quantity,
      name: product.name,
      price: item.price,
      image: product.primaryImage,
    });

    subtotal += item.price * item.quantity;
  }

  // Calculate tax and shipping
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const totalPrice = subtotal + tax + shipping;

  const order = new Order({
    userId,
    cartId: cart._id,
    items: validatedItems,
    subtotal,
    tax,
    shipping,
    totalPrice,
    shippingAddress: shippingAddress || req.user.address,
    billingAddress: billingAddress || shippingAddress || req.user.address,
    status: "pending",
    paymentStatus: "pending",
  });

  await order.save();

  return res.jsend.success(
    {
      message: "Order placed successfully",
      order: {
        id: order._id,
        totalPrice: order.totalPrice,
        status: order.status,
      },
    },
    201
  );
});

const getSingleOrder = wrapAsync(async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  const order = await Order.findOne({ _id: orderId, userId, isActive: true })
    .populate("items.productId", "name image price")
    .lean();

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  res.jsend.success({ order });
});

const getOrders = wrapAsync(async (req, res) => {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalOrders = await Order.countDocuments({ userId, isActive: true });
  const orders = await Order.find({ userId, isActive: true })
    .populate("items.productId", "name image price")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  if (totalOrders === 0) {
    return res.jsend.success({
      orders: [],
      message: "You have no orders yet.",
    });
  }

  return res.jsend.success({
    orders: orders,
    pagination: {
      total: totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
    },
  });
});

const updateOrder = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  const order = await Order.findOne({ _id: orderId, userId, isActive: true });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  if (
    order.status === "processing" ||
    order.status === "shipped" ||
    order.status === "delivered"
  ) {
    throw new AppError("Order cannot be cancelled at this stage", 400);
  }

  if (order.paymentStatus === "paid") {
    throw new AppError("Order cannot be cancelled after payment", 400);
  }

  order.status = "cancelled";
  await order.save();

  return res.jsend.success({ message: "Order cancelled successfully" });
});

module.exports = {
  makeOrder,
  getOrders,
  getSingleOrder,
  updateOrder,
};
