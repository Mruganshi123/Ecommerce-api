const asyncHandler = require("express-async-handler");
const PaymentService = require("./payment.service");

exports.createPayment = asyncHandler(async (req, res) => {
    const session = await PaymentService.createPayment(req, res);
    res.status(200).json({ id: session });
});

exports.handleStripeWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    await PaymentService.processWebhookEvent(req.rawBody, sig);
    res.status(200).send('Webhook received');
});