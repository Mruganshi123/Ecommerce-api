const express = require("express");
const router = express.Router();
const PaymentController = require("./payment.controller")

router.post("/webhook", express.raw({ type: 'application/json' }), PaymentController.handleStripeWebhook);

router.route("/").post(PaymentController.createPayment);

module.exports = router;