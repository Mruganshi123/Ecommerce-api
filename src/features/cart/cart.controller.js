const cartService = require("./cart.service");
const ApiResponse = require("../../utils/ApiResponse");

exports.getCart = async (req, res) => {
    const cart = await cartService.getCart(req);
    return new ApiResponse(res, 200, cart, "Cart fetched successfully");
};

exports.addToCart = async (req, res) => {
    const cart = await cartService.addToCart(req);
    return new ApiResponse(res, 201, cart, "Product added to cart successfully");
};

exports.updateCartItemQuantity = async (req, res) => {
    const cart = await cartService.updateCartItemQuantity(req);
    return new ApiResponse(res, 200, cart, "Cart item quantity updated successfully");
};

exports.removeCartItem = async (req, res) => {
    const cart = await cartService.removeCartItem(req);
    return new ApiResponse(res, 200, cart, "Cart item removed successfully");
};