const { decode } = require("jsonwebtoken");
const ApiError = require("../../utils/ApiError");
const { verifyToken } = require("../../utils/token")

module.exports = function (req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        throw new ApiError("authorization header is required", 401);
    }
    const token = header.split(' ')[1];
    if (!token) {
        throw new ApiError("token is required", 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        throw new ApiError("token is invalid", 401);
    }


    req.user = decoded;

    next();
};