const jsonwebtoken = require("jsonwebtoken");


exports.generateToken = (payload, expiresIn) => {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiresIn || process.env.JWT_EXPIRES_IN,
    });
};

exports.generateRefreshToken = (payload) => {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    });
};

exports.verifyToken = (token) => {
    return jsonwebtoken.verify(token, process.env.JWT_SECRET);
}
