
const Roles = require('../features/role/role.model');
const ApiError = require('../utils/ApiError');

module.exports = (...allowedRoles) => {

    return async (req, res, next) => {
        if (!req.user || !req.user.role) {
            throw new ApiError("Unauthorized", 401);
        }
        const userRole = await Roles.findById(req.user.role);
        if (allowedRoles.includes(userRole.role)) {
            return next();
        }



        throw new ApiError("You do not have permission to perform this action", 403);

    };
};
