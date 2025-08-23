const orderService = require("./order.service");
const ApiResponse = require("../../utils/ApiResponse");

exports.placeOrder = async (req, res) => {
    const order = await orderService.placeOrder(req);
    return new ApiResponse(res, 201, order, "Order placed successfully");
};

exports.getUserOrders = async (req, res) => {
    const orders = await orderService.getUserOrders(req);
    return new ApiResponse(res, 200, orders, "User orders fetched successfully");
};

exports.getOrderDetails = async (req, res) => {
    const order = await orderService.getOrderDetails(req);
    return new ApiResponse(res, 200, order, "Order details fetched successfully");
};

exports.cancelOrder = async (req, res) => {
    const order = await orderService.cancelOrder(req);
    return new ApiResponse(res, 200, order, "Order cancelled successfully");
};

exports.getVendorOrders = async (req, res) => {
    const orders = await orderService.getVendorOrders(req);
    return new ApiResponse(res, 200, orders, "Vendor orders fetched successfully");
};

exports.updateVendorOrderItemStatus = async (req, res) => {
    const order = await orderService.updateVendorOrderItemStatus(req);
    return new ApiResponse(res, 200, order, "Order item status updated successfully");
};

exports.getAllOrders = async (req, res) => {
    const orders = await orderService.getAllOrders(req);
    return new ApiResponse(res, 200, orders, "All orders fetched successfully");
};

exports.downloadInvoice = async (req, res) => {
    const { id: orderId } = req.params;
    const userId = req.user.id;

    if (req.user.role === 'admin' || req.user.role === 'vendor') {
        const invoiceBuffer = await orderService.downloadInvoice(orderId, null);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
        return res.send(invoiceBuffer);
    } else {
        const invoiceBuffer = await orderService.downloadInvoice(orderId, userId);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
        return res.send(invoiceBuffer);
    }
};