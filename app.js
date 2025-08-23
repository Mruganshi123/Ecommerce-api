require("dotenv").config();
const express = require('express');
const app = express();
const globalErrorHandler = require("./src/middlewares/globalErrorHandler")
const allowedRoles = require("./src/middlewares/allowedRoles.middleware");
const isAuthorized = require("./src/features/auth/auth.middleware");
const authRouter = require("./src/features/auth/auth.routes");
const rolesRouter = require("./src/features/role/role.routes");
const vendorRoutes = require("./src/features/vendor/vendor.routes");
const adminRoutes = require("./src/features/admin/admin.routes");
const productRoutes = require("./src/features/product/product.routes");
const categoryRoutes = require("./src/features/category/category.routes");
const wishListRoutes = require("./src/features/wishlist/wishlist.routes");
const orderRoutes = require("./src/features/order/order.routes");
const paymentRoutes = require("./src/features/payment/payment.routes");




app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/roles", isAuthorized, allowedRoles('admin'), rolesRouter);
app.use("/api/v1/admin", isAuthorized, allowedRoles('admin'), adminRoutes);
app.use("/api/v1/vendor", isAuthorized, allowedRoles('vendor'), vendorRoutes)
app.use("/api/v1/products", isAuthorized, productRoutes);
app.use("api/v1/categories", isAuthorized, allowedRoles('vendor', 'user', 'admin'), categoryRoutes);
app.use("api/v1/wishList", isAuthorized, wishListRoutes);
app.use("api/v1/orders", isAuthorized, orderRoutes);
app.use("api/v1/payment", isAuthorized, allowedRoles('user'), paymentRoutes);



app.use(globalErrorHandler);

module.exports = app;