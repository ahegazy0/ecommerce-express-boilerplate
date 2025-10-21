// routes/webhookRoute.js
const express = require("express");
const router = express.Router();
const handleWebhook = require("../controllers/webhook");

// WebHook
router.post("/", express.raw({ type: "application/json" }), handleWebhook);

module.exports = router;
