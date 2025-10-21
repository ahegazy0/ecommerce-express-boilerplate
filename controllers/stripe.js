const stripe = require("../config/stripe");
const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const wrapAsync = require("../utils/catchAsync");

const createCheckoutSession = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.body;
  const order = await Order.findOne({ _id: orderId, userId });

  if (!order) {
    throw new AppError("Product not found.", 404);
  }

  let lineItems = [];

  lineItems = order.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `${process.env.FRONTEND_BASE_URL}/api/payment/success`,
    cancel_url: `${process.env.FRONTEND_BASE_URL}/api/payment/cancel`,
    metadata: {
      userId,
      orderId: order._id.toString(),
    },
  });

  return res.jsend.success({ URL: session.url, ID: session.id });
});

const paymentSuccess = (req, res) => {
  return res.jsend.success({
    message: "Payment completed successfully. Order will be delivered shortly.",
  });
};

const paymentCancel = (req, res) => {
  return res.jsend.fail({
    message: "Payment was canceled by the user. No changes were made.",
  });
};

module.exports = {
  createCheckoutSession,
  paymentSuccess,
  paymentCancel,
};
