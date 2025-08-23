const Cart = require("./cart.model");
const Product = require("../product/product.model");
const Variant = require("../variants/variant.model");
const ApiError = require("../../utils/ApiError");

exports.getCart = async (req) => {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId }).populate("items.product items.variant");
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
};

exports.addToCart = async (req) => {
    const userId = req.user.id;
    const { productId, variantId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let priceToUse = product.price;
    let actualVariant = null;

    if (variantId) {
        actualVariant = await Variant.findById(variantId);
        if (!actualVariant || actualVariant.product.toString() !== productId) {
            throw new ApiError(404, "Variant not found or does not belong to the product");
        }
        priceToUse = actualVariant.price;
    }

    const existingItemIndex = cart.items.findIndex(
        (item) =>
            item.product.toString() === productId &&
            (variantId ? item.variant?.toString() === variantId : !item.variant)
    );

    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].price = priceToUse;
    } else {
        cart.items.push({
            product: productId,
            variant: variantId || undefined,
            quantity,
            price: priceToUse,
        });
    }

    await cart.save();
    return cart.populate("items.product items.variant");
};

exports.updateCartItemQuantity = async (req) => {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const item = cart.items.id(itemId);
    if (!item) {
        throw new ApiError(404, "Item not found in cart");
    }

    item.quantity = quantity;
    await cart.save();
    return cart.populate("items.product items.variant");
};

exports.removeCartItem = async (req) => {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    if (cart.items.length === initialLength) {
        throw new ApiError(404, "Item not found in cart");
    }

    await cart.save();
    return cart.populate("items.product items.variant");
};

exports.mergeCarts = async (req) => {
    const userId = req.user.id;
    const guestCartItems = req.body.guestCart || [];

    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
        userCart = await Cart.create({ user: userId, items: [] });
    }

    for (const guestItem of guestCartItems) {
        const product = await Product.findById(guestItem.product);
        if (!product) continue;

        let priceToUse = product.price;
        let actualVariant = null;

        if (guestItem.variant) {
            actualVariant = await Variant.findById(guestItem.variant);
            if (!actualVariant || actualVariant.product.toString() !== guestItem.product) {
                continue;
            }
            priceToUse = actualVariant.price;
        }

        const existingItemIndex = userCart.items.findIndex(
            (item) =>
                item.product.toString() === guestItem.product &&
                (guestItem.variant ? item.variant?.toString() === guestItem.variant : !item.variant)
        );

        if (existingItemIndex > -1) {
            userCart.items[existingItemIndex].quantity += guestItem.quantity;
            userCart.items[existingItemIndex].price = priceToUse;
        } else {
            userCart.items.push({
                product: guestItem.product,
                variant: guestItem.variant || undefined,
                quantity: guestItem.quantity,
                price: priceToUse,
            });
        }
    }
    await userCart.save();
    return userCart.populate("items.product items.variant");
};
