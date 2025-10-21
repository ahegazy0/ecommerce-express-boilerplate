const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const orderController = require("../controllers/order");

// Order Routes
router.get("/", auth.authenticateToken, orderController.getOrders);
router.get("/:id", auth.authenticateToken, orderController.getSingleOrder);
router.post("/", auth.authenticateToken, orderController.makeOrder);
router.patch("/:id/", auth.authenticateToken, orderController.updateOrder);

module.exports = router;
