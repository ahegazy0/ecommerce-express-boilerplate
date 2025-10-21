const Cart = require("../models/Cart");
const Product = require("../models/Product");
const wrapAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const addToCart = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  if (quantity > product.stock) {
    throw new AppError(`Insufficient stock. Available: ${product.stock}`, 400);
  }

  let cart = await Cart.findOne({ userId, isActive: true });

  if (!cart) {
    cart = new Cart({ userId });
  }

  await cart.addItem(productId, quantity, product.price);

  const populatedCart = await Cart.findOne({ userId, isActive: true }).populate(
    "items.productId",
    "name price images stock isActive"
  );

  return res.jsend.success({
    message: "Product added to cart",
    cart: populatedCart,
  });
});

const getCart = wrapAsync(async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.getOrCreateCart(userId);

  return res.jsend.success({ cart });
});

const clearCart = wrapAsync(async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ userId, isActive: true });

  if (!cart) {
    throw new AppError("Cart not found.", 404);
  }

  await cart.clearCart();

  return res.jsend.success({ message: "Cart cleared successfully." });
});

const removeFromCart = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  const cart = await Cart.findOne({ userId, isActive: true });
  if (!cart) {
    throw new AppError("Cart not found.", 404);
  }

  await cart.removeItem(productId);

  return res.jsend.success({
    message: "Product removed from cart successfully.",
  });
});

const updateCartItem = wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ userId, isActive: true });
  if (!cart) {
    throw new AppError("Cart not found.", 404);
  }

  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  if (quantity > product.stock) {
    throw new AppError(`Insufficient stock. Available: ${product.stock}`, 400);
  }

  await cart.updateItemQuantity(productId, quantity);

  const updatedCart = await Cart.findOne({ userId, isActive: true }).populate(
    "items.productId",
    "name price images stock isActive"
  );

  return res.jsend.success({
    message: "Cart item updated successfully",
    cart: updatedCart,
  });
});

module.exports = {
  getCart,
  addToCart,
  clearCart,
  removeFromCart,
  updateCartItem,
};
