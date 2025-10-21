const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const paymentController = require("../controllers/stripe");
// const handleWebhook = require("../controllers/webhook");

//Payment route
router.post(
  "/checkout",
  auth.authenticateToken,
  paymentController.createCheckoutSession
);
router.get("/success", paymentController.paymentSuccess);
router.get("/cancel", paymentController.paymentCancel);

//Webhook
// router.post("/webhook", handleWebhook);

module.exports = router;
