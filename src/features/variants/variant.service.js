const ApiError = require("../../utils/ApiError");
const Variant = require("./variant.model");
const User = require('../user/user.model')
const Role = require("../role/role.model");

exports.create = async (req) => {
    const variantData = {
        product: req.params.productID,
        sku: req.body.sku,
        price: req.body.price,
        discountPrice: req.body.discountPrice,
        stock: req.body.stock,
        attributes: req.body.attributes
        ,
    }

    if (req.files) {
        variantData.variantImages = req.files.variantImages.map((file) => {
            return file.path;
        })
    }
    const newVariant = await Variant.create(variantData);
    return newVariant;
}


exports.getAll = async (req) => {
    const user = req.user;
    const variants = await Variant.find({ product: req.params.productID })
        .populate({ path: 'product', select: 'vendor ' });

    if (!variants || variants.length === 0) throw new ApiError("No variants found", 404);

    const userRole = await Role.findById(user.role);

    if (userRole.role !== 'admin') {
        const vendorVariants = variants.filter(
            variant => variant.product.vendor.toString() === user.id
        );

        if (vendorVariants.length === 0) throw new ApiError("Unauthorized", 401);

        return vendorVariants;
    }
    return variants;
};


exports.update = async (req) => {
    const updateData = { ...req.body };

    if (req.files) {
        updateData.variantImages = req.files.variantImages.map((file) => {
            return file.path;
        })
    }

    const variant = await Variant.findByIdAndUpdate(
        req.params.variantID,
        { $set: updateData },
        { new: true } // Return the updated document
    );
    if (!variant) {
        throw new ApiError("Variant not found", 404);
    }
    return variant;
}

exports.delete = async (req) => {
    const variant = await Variant.findByIdAndDelete(req.params.variantID);
    if (!variant) {
        throw new ApiError("Variant not found", 404);
    }
    return variant;
}

exports.getById = async (req) => {
    const variant = await Variant.findById(req.params.variantID).populate("product");
    if (!variant) {
        throw new ApiError("Variant not found", 404);
    }
    return variant;
}
