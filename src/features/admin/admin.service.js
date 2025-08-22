const Vendor = require("../vendor/vendor.model");
const emailQueueModule = require("../../queue/email.queue");
const userModel = require("../user/user.model");
const ApiError = require("../../utils/ApiError");


exports.changeKycStatus = async (req) => {
    const { vendorID } = req.params;
    const { kycStatus } = req.body;

    // Validate status
    if (!["pending", "inReview", "approved", "rejected"].includes(kycStatus)) {
        throw new Error("Invalid status value");
    }

    // Get old status
    const beforeVendor = await Vendor.findById(vendorID).select("verification.kycStatus user");
    if (!beforeVendor) throw new Error("Vendor not found");

    const before = beforeVendor.verification.kycStatus;

    // Update vendor & populate user
    const vendor = await Vendor.findByIdAndUpdate(
        vendorID,
        {
            "verification.kycStatus": kycStatus,
            "verification.verifiedAt": new Date(),
            "verification.verifiedBy": req.user.id
        },
        { new: true }
    ).populate("user", "name email");

    if (!vendor) throw new Error("Vendor not found");

    // Approved case
    if (before === "pending" && vendor.verification.kycStatus === "approved") {
        await emailQueueModule.addEmailToQueue("vendorApproved", {
            to: vendor.user.email,
            subject: "Vendor Approved",
            type: "vendorApproved",
            payload: { vendorName: vendor.user.name },
        });
    }

    // Rejected case
    if (before === "pending" && vendor.verification.kycStatus === "rejected") {
        await emailQueueModule.addEmailToQueue("vendorRejected", {
            to: vendor.user.email,
            subject: "Vendor Rejected",
            type: "vendorRejected",
            payload: { vendorName: vendor.user.name },
        });
    }

    return vendor;
};