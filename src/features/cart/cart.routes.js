const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");

router.route("/")
    .get(cartController.getCart)
    .post(cartController.addToCart);

router.route("/:itemId").
    put(cartController.updateCartItemQuantity).
    delete(cartController.removeCartItem);

module.exports = router;