const mongoose = require("mongoose");

const Order = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartId: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        image: {
          type: String,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "stripe"],
      default: "credit_card",
    },
    paymentId: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
    trackingNumber: {
      type: String,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
Order.index({ userId: 1 });
// Order.index({ orderNumber: 1 });
Order.index({ status: 1 });
Order.index({ paymentStatus: 1 });
Order.index({ createdAt: -1 });

// Virtual for total items count
Order.virtual("itemCount").get(function () {
  if (!Array.isArray(this.items)) return 0;
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order status display
Order.virtual("statusDisplay").get(function () {
  const statusMap = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return statusMap[this.status] || this.status;
});

// Pre-save middleware to generate order number
Order.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(
      4,
      "0"
    )}`;
  }
  next();
});

// Instance method to update status
Order.methods.updateStatus = function (newStatus, note = null) {
  this.status = newStatus;
  if (note) {
    this.notes = note;
  }
  return this.save();
};

// Instance method to update payment status
Order.methods.updatePaymentStatus = function (newStatus, paymentId = null) {
  this.paymentStatus = newStatus;

  if (paymentId) {
    this.paymentId = paymentId;
  }

  if (newStatus === "paid") {
    this.paymentDate = new Date();
  }

  return this.save();
};

// Static method to get orders for user with pagination
Order.statics.getUserOrders = function (userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  return this.find({
    userId,
    isActive: true,
  })
    .populate("items.productId", "name image price")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model("Order", Order, "orders");
