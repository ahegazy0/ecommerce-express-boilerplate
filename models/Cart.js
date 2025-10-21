const mongoose = require("mongoose");

const Cart = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
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
          max: 99,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
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
// Cart.index({ userId: 1 });
Cart.index({ isActive: 1 });

// Virtual for total items count
Cart.virtual("itemCount").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for unique products count
Cart.virtual("uniqueProductCount").get(function () {
  return this.items.length;
});
      
// Pre-save middleware to calculate totals
Cart.pre("save", function (next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate tax (8% example)
  this.tax = this.subtotal * 0.08;

  // Calculate shipping (free over $50)
  this.shipping = this.subtotal === 0 ? 0 : this.subtotal > 50 ? 0 : 9.99;

  // Calculate total
  this.totalPrice = this.subtotal + this.tax + this.shipping;

  next();
});

// Instance method to add item to cart
Cart.methods.addItem = function (productId, quantity, price) {
  const existingItemIndex = this.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].price = price;
    this.items[existingItemIndex].addedAt = new Date();
  } else {
    // Add new item
    this.items.push({
      productId,
      quantity,
      price,
      addedAt: new Date(),
    });
  }

  return this.save();
};

// Instance method to remove item from cart
Cart.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  return this.save();
};

// Instance method to update item quantity
Cart.methods.updateItemQuantity = function (productId, quantity) {
  const item = this.items.find(
    (item) => item.productId.toString() === productId.toString()
  );

  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    } else {
      item.quantity = quantity;
      return this.save();
    }
  }

  throw new Error("Item not found in cart");
};

// Instance method to clear cart
Cart.methods.clearCart = function () {
  this.items = [];
  return this.save();
};

// Static method to get or create cart for user
Cart.statics.getOrCreateCart = async function (userId) {
  let cart = await this.findOne({ userId, isActive: true });

  if (!cart) {
    cart = await this.create({ userId });
  }

  return cart.populate({
    path: "items.productId",
    select: "name price images stock isActive",
  });
};

module.exports = mongoose.model("Cart", Cart, "carts");
