const stripe = require("../../config/stripe.confing")
const Order = require("./order.model");
const Cart = require("../cart/cart.model");
const Product = require("../product/product.model");
const Variant = require("../variants/variant.model");
const ApiError = require("../../utils/ApiError");
const emailQueueModule = require("../queue/email.queue");
const axios = require('axios');
const { setCache, getCache, deleteCache } = require("../../utils/cache");


exports.placeOrder = async (req, stripeSessionId = null) => {
    deleteCache("allOrders");
    deleteCache(`userOrders_${req.user.id}`);
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product items.variant");
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    const orderItems = [];
    for (const item of cart.items) {
        const product = item.product;
        const variant = item.variant;

        if (!product) {
            throw new ApiError(404, `Product not found for item ${item._id}`);
        }

        let availableStock = product.stock;
        if (variant) {
            const actualVariant = await Variant.findById(variant._id);
            if (!actualVariant) {
                throw new ApiError(404, `Variant not found for item ${item._id}`);
            }
            availableStock = actualVariant.stock;
        }

        if (availableStock < item.quantity) {
            throw new ApiError(400, `Not enough stock for ${product.name} (Variant: ${variant?.name || 'N/A'})`);
        }

        orderItems.push({
            product: product._id,
            variant: variant ? variant._id : undefined,
            vendor: product.vendor,
            quantity: item.quantity,
            price: item.price,
            status: "placed",
        });
    }

    const order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : (paymentMethod === "online" ? "pending" : "pending"), // For online, it will be updated by gateway
        stripeSessionId: stripeSessionId,
        orderStatus: "pending",
    });

    // Decrease stock 
    for (const item of cart.items) {
        let updatedProductOrVariant;
        if (item.variant) {
            updatedProductOrVariant = await Variant.findByIdAndUpdate(item.variant._id, { $inc: { stock: -item.quantity } }, { new: true });
        } else {
            updatedProductOrVariant = await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } }, { new: true });
        }

        //  send email
        if (updatedProductOrVariant && updatedProductOrVariant.stock <= process.env.LOW_STOCK_THRESHOLD) {
            await emailQueueModule.addEmailToQueue('lowStockWarning', {
                to: item.vendor.email,
                subject: "Low Stock Warning",
                type: 'lowStockWarning',
                payload: {
                    productName: updatedProductOrVariant.name,
                    currentStock: updatedProductOrVariant.stock,
                    threshold: process.env.LOW_STOCK_THRESHOLD,
                    vendorId: item.vendor.toString(),
                },
            });
        }
    }

    await Cart.findByIdAndDelete(cart._id);

    return order.populate("items.product items.variant items.vendor");
};

exports.updateOrderStatusAndPayment = async (stripeSessionId, paymentStatus, orderStatus, invoiceId = null) => {
    deleteCache("allOrders");
    // More specific cache invalidation for user orders might be needed here if user orders are cached individually
    const updateFields = { paymentStatus: paymentStatus, orderStatus: orderStatus };
    if (invoiceId) {
        updateFields.invoiceId = invoiceId;
    }
    const order = await Order.findOneAndUpdate(
        { stripeSessionId: stripeSessionId },
        updateFields,
        { new: true }
    );

    if (!order) {
        console.error(`Order with Stripe Session ID ${stripeSessionId} not found.`);
        return null;
    }
    return order;
};

exports.getUserOrders = async (req) => {
    const userId = req.user.id;
    const cacheKey = `userOrders_${userId}`;
    let orders = getCache(cacheKey);

    if (!orders) {
        orders = await Order.find({ user: userId }).populate("items.product items.variant items.vendor");
        setCache(cacheKey, orders);
    }
    return orders;
};

exports.getOrderDetails = async (req) => {
    const { id } = req.params;
    const cacheKey = `orderDetails_${id}`;
    let order = getCache(cacheKey);

    if (!order) {
        order = await Order.findById(id).populate("items.product items.variant items.vendor");
        if (!order) {
            throw new ApiError(404, "Order not found");
        }
        setCache(cacheKey, order);
    }
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'vendor') { // Assuming req.user.role is available
        throw new ApiError(403, "Unauthorized access to order");
    }
    return order;
};

exports.cancelOrder = async (req) => {
    deleteCache("allOrders");
    deleteCache(`userOrders_${req.user.id}`);
    deleteCache(`orderDetails_${req.params.id}`);
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
        throw new ApiError(404, "Order not found or you are not authorized to cancel it");
    }

    if (order.orderStatus === "delivered" || order.orderStatus === "shipped") {
        throw new ApiError(400, "Cannot cancel an order that is already shipped or delivered");
    }

    order.orderStatus = "cancelled";
    order.paymentStatus = "refunded";

    // Restore stock
    for (const item of order.items) {
        if (item.variant) {
            await Variant.findByIdAndUpdate(item.variant, { $inc: { stock: item.quantity } });
        } else {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
    }

    await order.save();
    return order.populate("items.product items.variant items.vendor");
};

exports.getVendorOrders = async (req) => {
    const vendorId = req.user.id;
    const orders = await Order.find({ "items.vendor": vendorId }).populate("items.product items.variant items.vendor");
    const filteredOrders = orders.map(order => ({
        ...order.toObject(),
        items: order.items.filter(item => item.vendor.toString() === vendorId.toString())
    }));
    return filteredOrders;
};

exports.updateVendorOrderItemStatus = async (req) => {
    deleteCache("allOrders");
    // Invalidate user specific caches if applicable
    const { id, itemId } = req.params;
    const { status } = req.body;
    const vendorId = req.user.id;

    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const item = order.items.id(itemId);
    if (!item) {
        throw new ApiError(404, "Order item not found");
    }

    if (item.vendor.toString() !== vendorId.toString()) {
        throw new ApiError(403, "You are not authorized to update this item's status");
    }

    item.status = status;
    await order.save();
    return order.populate("items.product items.variant items.vendor");
};

exports.getAllOrders = async (req) => {
    const cacheKey = "allOrders";
    let orders = getCache(cacheKey);

    if (!orders) {
        orders = await Order.find({}).populate("items.product items.variant items.vendor");
        setCache(cacheKey, orders);
    }
    return orders;
};

exports.downloadInvoice = async (orderId, userId) => {
    const cacheKey = `invoice_${orderId}`;
    let invoiceData = getCache(cacheKey);

    if (!invoiceData) {
        const order = await Order.findById(orderId).populate("items.product items.variant items.vendor");

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        const isOrderOwner = userId && order.user.toString() === userId;
        const isVendorOfOrderItem = userId && order.items.some(item => item.vendor.toString() === userId);

        if (userId && !isOrderOwner && !isVendorOfOrderItem) {
            throw new ApiError(403, "Unauthorized access to order invoice");
        }

        if (!order.invoiceId) {
            throw new ApiError(404, "Invoice not available for this order.");
        }

        const invoice = await stripe.invoices.retrieve(order.invoiceId);

        if (!invoice || !invoice.invoice_pdf) {
            throw new ApiError(404, "Stripe invoice PDF not found.");
        }

        const response = await axios.get(invoice.invoice_pdf, { responseType: 'arraybuffer' });
        setCache(cacheKey, response.data, 3600000);
        return response.data;
    };
}
