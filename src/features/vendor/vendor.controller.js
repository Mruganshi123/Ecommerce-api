const asyncHandler = require("express-async-handler");
const vendorService = require("./vendor.service");

exports.setUpVendorProfile = asyncHandler(async (req, res) => {
    const vendor = await vendorService.setUpProfile(req);
    res.status(200).json(vendor);
});