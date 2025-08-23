const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');

router.get("/", categoryController.getAllCategory);

module.exports = router;