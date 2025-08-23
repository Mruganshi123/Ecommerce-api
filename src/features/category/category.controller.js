const asyncHandler = require("express-async-handler");
const CategoryService = require("./category.service");
const ApiResponse = require("../../utils/ApiResponse");

exports.getAllCategory = asyncHandler(async (req, res) => {
    const categories = await CategoryService.getAll();
    const response = new ApiResponse(200, "categories fetched successfully", "success", categories);
    res.status(200).send(response);
});