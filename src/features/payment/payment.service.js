const stripe = require("../../config/stripe.confing")
const OrderService = require("../order/order.service")

exports.createPayment = async (req, res) => {
    const { products } = req.body;

    const order = await OrderService.placeOrder(req);

    const lineItems = products.map((product) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: product.name,
            },
            unit_amount: product.price * 100,
        },
        quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'upi', 'paytm', 'netbanking', 'wallet'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        metadata: { orderId: order._id.toString() },
    });

    await OrderService.updateOrderStatusAndPayment(session.id, order.paymentStatus, order.orderStatus);

    return session.id;
};

exports.processWebhookEvent = async (rawBody, sig) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        throw new Error("Webhook Error: Invalid signature");
    }

    switch (event.type) {
        case 'checkout.session.completed':
            {
                const session = event.data.object;
                console.log(`Checkout session completed: ${session.id}`);
                const invoiceId = session.invoice; // Get the invoice ID
                await OrderService.updateOrderStatusAndPayment(session.id, 'paid', 'confirmed', invoiceId);
            }
            break;
        case 'checkout.session.expired':
        case 'checkout.session.async_payment_failed':
        case 'checkout.session.failed':
            {
                const session = event.data.object;
                console.log(`Checkout session failed: ${session.id}`);
                await OrderService.updateOrderStatusAndPayment(session.id, 'failed', 'cancelled');
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }
};