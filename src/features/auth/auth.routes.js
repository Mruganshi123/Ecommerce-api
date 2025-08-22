const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');


router.post("/register", authController.register('user'));
router.post("/register-vendor", authController.register('vendor'));
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/logout", authController.logOut);
module.exports = router;