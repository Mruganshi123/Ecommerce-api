const asyncHandler = require("express-async-handler");
const adminService = require("./admin.service");
const ApiResponse = require("../../utils/ApiResponse");
const vendorService = require("../vendor/vendor.service");
const CategoryService = require("../category/category.service");

exports.getPendingVendors = asyncHandler(async (req, res) => {
    const vendors = await vendorService.getPendingVendors();
    const response = new ApiResponse(200, "Pending vendors fetched successfully", "success", vendors);
    res.status(200).send(response);
});

exports.getVendors = asyncHandler(async (req, res) => {
    const vendors = await vendorService.getVendors();
    const response = new ApiResponse(200, "Vendors fetched successfully", "success", vendors);
    res.status(200).send(response);
});

exports.getVendorById = asyncHandler(async (req, res) => {
    const vendor = await vendorService.getVendorById(req);
    const populatedVendor = await vendor.populate(["user"]);
    const response = new ApiResponse(200, "Vendor fetched successfully", "success", populatedVendor);
    res.status(200).send(response);
});

exports.deleteVendor = asyncHandler(async (req, res) => {
    const vendor = await vendorService.deleteVendor(req);
    const response = new ApiResponse(200, "Vendor deleted successfully", "success", vendor);
    res.status(200).send(response);
});

exports.changeKycStatus = asyncHandler(async (req, res) => {
    const vendor = await adminService.changeKycStatus(req);
    const response = new ApiResponse(
        200,
        "status changed successfully",
        "success",
        vendor
    );
    res.status(200).send(response);

})


exports.createCategory = asyncHandler(async (req, res) => {
    const category = await CategoryService.create(req);
    const response = new ApiResponse(200, "category created successfully", "success", category);
    res.status(200).send(response);
})

exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await CategoryService.getAll();
    const response = new ApiResponse(200, "categories fetched successfully", "success", categories);
    res.status(200).send(response);
})

exports.getCategoryById = asyncHandler(async (req, res) => {
    const category = await CategoryService.getById(req);
    const response = new ApiResponse(200, "category fetched successfully", "success", category);
    res.status(200).send(response);
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const category = await CategoryService.update(req);
    const response = new ApiResponse(200, "Category updated successfully", "success", category);
    res.status(200).send(response);
})

exports.deleteCategory = asyncHandler(async (req, res) => {
    const category = await CategoryService.delete(req);
    const response = new ApiResponse(200, "Category updated successfully", "success", category);
    res.status(200).send(response);
})