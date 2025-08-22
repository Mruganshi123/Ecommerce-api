const Vendor = require("./vendor.model");
const ApiError = require("../../utils/ApiError");
const emailQueueModule = require("../../queue/email.queue");

exports.setUpProfile = async (req) => {

    const vendorData = {
        user: req.user.id,
        businessType: req.body.businessType,
        businessName: req.body.businessName,
        businessRegistrationNumber: req.body.businessRegistrationNumber,
        dateOfIncorporation: req.body.dateOfIncorporation,
        tradeLicenseNumber: req.body.tradeLicenseNumber,
        address: req.body.address,
        // pickupAddress: req.body.pickupAddress,
        // returnAddress: req.body.returnAddress,
        bankDetails: req.body.bankDetails,

        verification: { kycStatus: "pending" },
        documents: {
            panCard: req.files?.panCard?.[0]?.path || null,
            gstCertificate: req.files?.gstCertificate?.[0]?.path || null,
            businessRegistration: req.files?.businessRegistration?.[0]?.path || null,
            addressProof: req.files?.addressProof?.[0]?.path || null,
            bankProof: req.files?.bankProof?.[0]?.path || null,
            tradeLicense: req.files?.tradeLicense?.[0]?.path || null,
            ownerIdProof: req.files?.ownerIdProof?.[0]?.path || null,
        },

        store: {
            name: req.body.name,
            logo: req.files?.logo?.[0]?.path || null,
            description: req.body.description,
            policies: {
                shippingPolicy: req.body.shippingPolicy,
                returnPolicy: req.body.returnPolicy,
                privacyPolicy: req.body.privacyPolicy,
            },
        },
    };

    const newVendor = await Vendor.create(vendorData);

    //to admin informing about the new vendor
    await emailQueueModule.addEmailToQueue('newVendorRegistered', {
        to: process.env.ADMIN_EMAIL,
        subject: "newVendorRegistered",
        type: 'newVendorRegistered',
        payload: {
            vendorName: await User.findOne({ id: newVendor._id }).select('name'),
        },
    });

    //to vendor informing about the succesfull registration
    await emailQueueModule.addEmailToQueue('registration', {
        to: req.user.email,
        subject: "registration compelted",
        type: 'registration',
        payload: {
            vendorName: await User.findOne({ id: newVendor._id }).select('name'),
        },
    });
    return newVendor;
}

exports.getPendingVendors = async () => {
    const vendors = await Vendor.find({ "verification.kycStatus": "pending" });
    return vendors;
};

exports.getVendors = async () => {
    const vendors = await Vendor.find({});
    return vendors;
};

exports.getVendorById = async (req) => {
    const { vendorID } = req.params;
    const vendor = await Vendor.findById(vendorID);
    if (!vendor) {
        throw new ApiError("Vendor not found", 404);
    }
    return vendor;
};

exports.deleteVendor = async (req) => {
    const { vendorID } = req.params;
    const deleted = await Vendor.findByIdAndDelete(vendorID);
    if (!deleted) {
        throw new ApiError("Vendor not found", 404);
    }
    return deleted;
};



