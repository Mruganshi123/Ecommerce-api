const Role = require("./role.model");
const ApiError = require("../../utils/ApiError");
const { setCache, getCache, deleteCache } = require("../../utils/cache");

exports.create = async (req) => {
    deleteCache("allRoles");
    const exists = await Role.findOne({ role: req.body.role });
    if (exists) throw new ApiError(false, "Role already exists", 400);
    return await Role.create({ role: req.body.role });
};

exports.getAll = async () => {
    const cacheKey = "allRoles";
    let roles = getCache(cacheKey);

    if (!roles) {
        roles = await Role.find();
        setCache(cacheKey, roles);
    }
    return roles;
};

exports.getOne = async (req) => {
    const roleId = req.params.roleId;
    const cacheKey = `role_${roleId}`;
    let role = getCache(cacheKey);

    if (!role) {
        role = await Role.findById(roleId);
        if (!role) throw new ApiError(false, "Role not found", 404);
        setCache(cacheKey, role);
    }
    return role;
};

exports.update = async (req) => {
    deleteCache("allRoles");
    deleteCache(`role_${req.params.roleId}`);
    const role = await Role.findByIdAndUpdate(
        req.params.roleId,
        { role: req.body.role },
        { new: true, runValidators: true }
    );
    if (!role) throw new ApiError(false, "Role not found", 404);
    return role;
};

exports.delete = async (req) => {
    deleteCache("allRoles");
    deleteCache(`role_${req.params.roleId}`);
    const role = await Role.findByIdAndDelete(req.params.roleId);
    if (!role) throw new ApiError(false, "Role not found", 404);
    return role;
};