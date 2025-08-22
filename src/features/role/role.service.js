const Role = require("./role.model");
const ApiError = require("../../utils/ApiError");

exports.create = async (req) => {
    const exists = await Role.findOne({ role: req.body.role });
    if (exists) throw new ApiError(false, "Role already exists", 400);
    return await Role.create({ role: req.body.role });
};

exports.getAll = async () => {
    return await Role.find();
};

exports.getOne = async (req) => {
    const role = await Role.findById(req.params.roleId);
    if (!role) throw new ApiError(false, "Role not found", 404);
    return role;
};

exports.update = async (req) => {
    const role = await Role.findByIdAndUpdate(
        req.params.roleId,
        { role: req.body.role },
        { new: true, runValidators: true }
    );
    if (!role) throw new ApiError(false, "Role not found", 404);
    return role;
};

exports.delete = async (req) => {
    const role = await Role.findByIdAndDelete(req.params.roleId);
    if (!role) throw new ApiError(false, "Role not found", 404);
    return role;
};