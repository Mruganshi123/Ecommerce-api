const asyncHandler = require("express-async-handler")
const ApiResponse = require("../../utils/ApiResponse");
const ProductService = require("./product.service");
const VariantService = require("../variants/variant.service")

// Create Product
exports.createProduct = asyncHandler(async (req, res) => {
    const product = await ProductService.create(req);
    const response = new ApiResponse(200, "Product created successfully", "success", product);
    res.status(200).send(response);
});

// Get All Products
exports.getAllProducts = asyncHandler(async (req, res) => {
    const products = await ProductService.getAll(req);
    const response = new ApiResponse(200, "Products fetched successfully", "success", products);
    res.status(200).send(response);
});

// Get Product by ID
exports.getProductById = asyncHandler(async (req, res) => {
    const product = await ProductService.getById(req);
    const response = new ApiResponse(200, "Product fetched successfully", "success", product);
    res.status(200).send(response);
});

// Update Product
exports.updateProduct = asyncHandler(async (req, res) => {
    const product = await ProductService.update(req);
    const response = new ApiResponse(200, "Product updated successfully", "success", product);
    res.status(200).send(response);
});

// Delete Product
exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await ProductService.delete(req);
    const response = new ApiResponse(200, "Product deleted successfully", "success", product);
    res.status(200).send(response);
});

exports.changeProductStatus = asyncHandler(async (req, res) => {
    const product = await ProductService.changeStatus(req);
    const response = new ApiResponse(200, "Product status changed successfully", "success", product);
    res.status(200).send(response);
})

exports.updateProductStock = asyncHandler(async (req, res) => {
    const product = await ProductService.updateStock(req);
    const response = new ApiResponse(200, "Product stock changed successfully", "success", product);
    res.status(200).send(response);
})


exports.createProductVariants = asyncHandler(async (req, res) => {
    const product = await VariantService.create(req);
    const response = new ApiResponse(200, "Product status changed successfully", "success", product);
    res.status(200).send(response);
})


exports.getAllProductVariants = asyncHandler(async (req, res) => {
    const product = await VariantService.getAll(req);
    const response = new ApiResponse(200, "Product status changed successfully", "success", product);
    res.status(200).send(response);
})

exports.updateProductVariant = asyncHandler(async (req, res) => {
    const product = await VariantService.update(req);
    const response = new ApiResponse(200, "Product status changed successfully", "success", product);
    res.status(200).send(response);
})

exports.deleteProductVariant = asyncHandler(async (req, res) => {
    const product = await VariantService.delete(req);
    const response = new ApiResponse(200, "Product status changed successfully", "success", product);
    res.status(200).send(response);
})

exports.getProductVariant = asyncHandler(async (req, res) => {
    const product = await VariantService.getById(req);
    const response = new ApiResponse(200, "Product status changed successfully", "success", product);
    res.status(200).send(response);
})

exports.bulkUpload = asyncHandler(async (req, res) => {
    const product = await ProductService.bulkUpload(req);
    const response = new ApiResponse(200, "Product status changed successfully", "success", product);
    res.status(200).send(response);
})

