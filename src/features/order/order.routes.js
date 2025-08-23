const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const allowedRoles = require("../../middlewares/allowedRoles.middleware");

// Customer Routes
router.post("/checkout", authenticate, orderController.placeOrder);
router.get("/", authenticate, orderController.getUserOrders);
router.get("/:id", authenticate, orderController.getOrderDetails);
router.put("/:id/cancel", authenticate, orderController.cancelOrder);
router.get("/:id/invoice", authenticate, allowedRoles(['admin', 'vendor']), orderController.downloadInvoice);

// Vendor Routes
router.get("/vendor", authenticate, allowedRoles("vendor"), orderController.getVendorOrders);
router.put("/vendor/:id/items/:itemId/status", authenticate, allowedRoles("vendor"), orderController.updateVendorOrderItemStatus);

// Admin Routes
router.get("/admin", authenticate, allowedRoles("admin"), orderController.getAllOrders);

module.exports = router;
