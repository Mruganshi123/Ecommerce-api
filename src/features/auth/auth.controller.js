const authService = require("./auth.service");
const asyncHandler = require("express-async-handler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const Roles = require("../role/role.model");

exports.login = asyncHandler(async (req, res) => {
    const data = await authService.login(req);

    const response = new ApiResponse(200, "User logged in successfully", "success", { user: data.user, token: data.loginToken });
    res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
    });
    res.status(200).json(response);
});

exports.register = (roleName) => {
    return asyncHandler(async (req, res) => {

        const roleDoc = await Roles.findOne({ role: roleName }).select({
            _id: 1,
        })


        if (!roleDoc) throw new ApiError(`Role ${roleName} not found`, 400);
        req.body.role = roleDoc._id;
        console.log(req.body);


        const user = await authService.register(req.body);

        res.status(200).json(new ApiResponse(200, "User registered successfully", "success", user));
    });
};

exports.logOut = asyncHandler(async (req, res) => {
    const data = await authService.logOut(req);
    const response = new ApiResponse(200, "User logged out successfully", "success", data);
    res.status(200).json(response);
});

exports.forgotPassword = asyncHandler(async (req, res) => {
    const data = await authService.resetPassword(req);
    const response = new ApiResponse(200, "Password reset link sent successfully", "success", data);
    res.status(200).json(response);
});
