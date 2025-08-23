const wishlistService = require("./wishlist.service");
const ApiResponse = require("../../utils/ApiResponse");

exports.getWishlist = async (req, res) => {
    const wishlist = await wishlistService.getWishlist(req.user.id);
    return new ApiResponse(res, 200, wishlist, "Wishlist fetched successfully");
};

exports.addToWishlist = async (req, res) => {
    const { productId, variantId } = req.body;
    const wishlist = await wishlistService.addToWishlist(req.user.id, productId, variantId);
    return new ApiResponse(res, 201, wishlist, "Product added to wishlist successfully");
};

exports.removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    const wishlist = await wishlistService.removeFromWishlist(req.user.id, productId);
    return new ApiResponse(res, 200, wishlist, "Product removed from wishlist successfully");
};
