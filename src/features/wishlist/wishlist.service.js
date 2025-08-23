const Wishlist = require("./wishlist.model");
const ApiError = require("../../utils/ApiError");

exports.getWishlist = async (userId) => {
    let wishlist = await Wishlist.findOne({ user: userId }).populate("items.product items.variant");
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, items: [] });
    }
    return wishlist;
};

exports.addToWishlist = async (userId, productId, variantId) => {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    const existingItemIndex = wishlist.items.findIndex(
        (item) =>
            item.product.toString() === productId &&
            (variantId ? item.variant?.toString() === variantId : !item.variant)
    );

    if (existingItemIndex > -1) {
        throw new ApiError(400, "Product/variant already in wishlist");
    }

    wishlist.items.push({ product: productId, variant: variantId });
    await wishlist.save();
    return wishlist.populate("items.product items.variant");
};

exports.removeFromWishlist = async (userId, productId) => {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
        throw new ApiError(404, "Wishlist not found");
    }

    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
        (item) => item.product.toString() !== productId
    );

    if (wishlist.items.length === initialLength) {
        throw new ApiError(404, "Product not found in wishlist");
    }

    await wishlist.save();
    return wishlist.populate("items.product items.variant");
};

exports.mergeWishlists = async (userId, guestWishlistItems) => {
    let userWishlist = await Wishlist.findOne({ user: userId });
    if (!userWishlist) {
        userWishlist = await Wishlist.create({ user: userId, items: [] });
    }

    for (const guestItem of guestWishlistItems) {
        const existingItemIndex = userWishlist.items.findIndex(
            (item) =>
                item.product.toString() === guestItem.product &&
                (guestItem.variant ? item.variant?.toString() === guestItem.variant : !item.variant)
        );
        if (existingItemIndex === -1) {
            userWishlist.items.push(guestItem);
        }
    }
    await userWishlist.save();
    return userWishlist.populate("items.product items.variant");
};
