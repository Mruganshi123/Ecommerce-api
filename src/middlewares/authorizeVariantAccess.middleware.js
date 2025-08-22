const Role = require("../features/role/role.model");
const ApiError = require("../utils/ApiError");
const Variant = require("../features/variants/variant.model");

module.exports = async (req, res, next) => {
    try {
        const user = req.user;
        const userRole = await Role.findById(req.user.role).select("role");

        // Optional: you can skip querying Role if req.user.role already has "vendor/admin"
        // const userRole = await Role.findById(user.role);
        // const role = userRole.role;

        const variant = await Variant.findById(req.params.variantID).populate({
            path: "product",
            select: "vendor",
        });

        if (!variant) {
            throw new ApiError("Variant not found", 404);
        }

        // Admin bypass
        if (userRole.role === "admin") return next();

        // Vendor ownership check
        if (userRole.role === "vendor" && variant.product.vendor.toString() === user.id) {
            return next();
        }

        throw new ApiError("Not authorized to perform this action", 403);
    } catch (error) {
        next(error);
    }
};
