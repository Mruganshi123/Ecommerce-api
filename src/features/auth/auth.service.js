const User = require("../user/user.model")
const ApiError = require("../../utils/ApiError");
const { decryptPassword, encryptPassword } = require("../../utils/password");
const { generateToken, generateRefreshToken, verifyToken } = require("../../utils/token");


exports.register = async (reqBody) => {

    console.log("service", reqBody);

    const { email, password, name, role, number } = reqBody;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError("Email already exists", 409);
    }
    const encryptedPassword = encryptPassword(password);
    const newUser = new User({ name, email, password: encryptedPassword, role, number });
    await newUser.save();
    return newUser;
}

exports.login = async (req) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError("Email not found", 404);
    }

    if (!(decryptPassword(password, user.password))) {
        throw new ApiError("Password not matched", 404);
    }

    const loginToken = generateToken({ id: user._id, email: user.email, role: user.role })

    const refreshToken = generateRefreshToken({ id: user._id, email: user.email, role: user.role })

    return {
        user,
        loginToken,
        refreshToken
    }

}

exports.logOut = async (req, res) => {
    const refreshToken = req.cookies ? req.cookies.refreshToken : "";
    if (!refreshToken) {
        throw new ApiError("Refresh Token not found", 404);
    }
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
        throw new ApiError("Invalid Refresh Token", 404);
    }

    res.cookie('refreshToken', '', {
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(Date.now() - 1000)
    });
}

exports.resetPassword = async (req) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new ApiError("Invalid Email", 404);
    }
    const resetToken = generateToken({
        id: user._id,
        email: user.email,
    }, '3h');

    // schedule a reset password email
    return { resetToken };
}