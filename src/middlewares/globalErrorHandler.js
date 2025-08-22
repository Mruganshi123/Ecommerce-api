// src/middlewares/globalErrorHandler.js
const ApiError = require("../utils/ApiError");

const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const success = err.success !== undefined ? err.success : false;
    // console.log(err.stack);

    res.status(statusCode).json({
        success,
        message: err.message || "Internal Server Error",
        stack: err.stack
    });
};

module.exports = globalErrorHandler;