const express = require("express");
const router = express.Router();
const wishListController = require("./wishlist.controller");

router.route("/").
    get(wishListController.getWishlist).
    post(wishListController.addToWishlist);

router.route("/:productId").delete(wishListController.removeFromWishlist);

module.exports = router;
