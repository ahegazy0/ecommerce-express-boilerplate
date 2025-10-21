const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const cartController = require("../controllers/cart");
const validate = require("../middlewares/validate");
const objectIdSchema = require("../validators/objectIdValid");
const validator = require("../validators/cartValid");

// Cart Routes
router.get("/", auth.authenticateToken, cartController.getCart);
router.post(
  "/",
  auth.authenticateToken,
  validate(validator.addToCartSchema),
  cartController.addToCart
);
router.put(
  "/",
  auth.authenticateToken,
  validate(validator.addToCartSchema),
  cartController.updateCartItem
);
router.delete("/", auth.authenticateToken, cartController.clearCart);
router.delete(
  "/:id",
  auth.authenticateToken,
  validate(objectIdSchema(), "params"),
  cartController.removeFromCart
);

module.exports = router;
