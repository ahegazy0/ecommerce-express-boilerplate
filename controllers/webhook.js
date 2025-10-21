const mongoose = require("mongoose");
const stripe = require("../config/stripe");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const AppError = require("../utils/AppError");

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (err) {
    return res
      .status(400)
      .json({ status: "fail", message: `Webhook Error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const sessionDb = await mongoose.startSession();
    sessionDb.startTransaction();

    try {
      const sessionData = event.data.object;
      const userId = sessionData.metadata.userId;
      const orderId = sessionData.metadata.orderId;

      const order = await Order.findOne({ _id: orderId, userId }).session(
        sessionDb
      );
      if (!order) throw new AppError("Order not found", 404);

      order.status = "processing";
      order.paymentStatus = "paid";
      order.paymentId = sessionData.payment_intent;
      order.paymentDate = new Date();
      await order.save({ session: sessionDb });

      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], totalPrice: 0 } },
        { session: sessionDb }
      );

      for (const item of order.items) {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true, session: sessionDb }
        );
        if (!updatedProduct)
          throw new AppError(
            `Insufficient stock for product: ${item.productId}`,
            400
          );
      }

      await sessionDb.commitTransaction();
      sessionDb.endSession();

      console.log(`✅ Order ${orderId} paid. Stock updated, cart cleared.`);
    } catch (err) {
      await sessionDb.abortTransaction();
      sessionDb.endSession();
      console.error("❌ Webhook Error:", err);
      return res.status(200).json({
        status: "fail",
        data: { message: "Order payment succeeded but stock update failed" },
      });
    }
  }

  return res.status(200).json({ status: "success", received: true });
};

module.exports = handleWebhook;
