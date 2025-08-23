const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "product",
                    required: true,
                },
                variant: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "variant",
                },
                vendor: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "vendor",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["placed", "processing", "shipped", "delivered", "cancelled", "returned"],
                    default: "placed",
                },
            },
        ],
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["credit_card", "debit_card", "online", "cash_on_delivery"],
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
        stripeSessionId: {
            type: String,
        },
        invoiceId: {
            type: String,
        },
        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);


