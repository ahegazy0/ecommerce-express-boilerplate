// Core Models
const User = require("./User");
const Product = require("./Product");
const Cart = require("./Cart");
const Order = require("./Order");
const Review = require("./Review");

// Export all models
module.exports = {
  User,
  Product,
  Cart,
  Order,
  Review,
};

// Export individual models for backward compatibility
module.exports.User = User;
module.exports.Product = Product;
module.exports.Cart = Cart;
module.exports.Order = Order;
module.exports.Review = Review;
