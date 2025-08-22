const roleService = require('./role.service');
const asyncHandler = require('express-async-handler');
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");

exports.create = asyncHandler(async (req, res) => {
    const role = await roleService.create(req);
    const response = new ApiResponse(201, 'Role created successfully', 'success', role);
    res.status(201).send(response);
});

exports.getAll = asyncHandler(async (req, res) => {
    const roles = await roleService.getAll();
    const response = new ApiResponse(200, 'Roles fetched successfully', 'success', roles);
    res.status(200).send(response);
});

exports.getOne = asyncHandler(async (req, res) => {
    const role = await roleService.getOne(req);
    const response = new ApiResponse(200, 'Role fetched successfully', 'success', role);
    res.status(200).send(response);
});

exports.update = asyncHandler(async (req, res) => {
    const role = await roleService.update(req);
    const response = new ApiResponse(200, 'Role updated successfully', 'success', role);
    res.status(200).send(response);
});

exports.delete = asyncHandler(async (req, res) => {
    const role = await roleService.delete(req);
    const response = new ApiResponse(200, 'Role deleted successfully', 'success', role);
    res.status(200).send(response);
});
