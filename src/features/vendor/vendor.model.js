const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    // Business Details
    businessType: { type: String, enum: ["individual", "company", "partnership", "trust"], required: true },
    businessName: { type: String, required: true },
    businessRegistrationNumber: String, // GSTIN or Registration number
    dateOfIncorporation: Date,
    tradeLicenseNumber: String,

    // Address
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    pickupAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    returnAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },

    // Banking Details
    bankDetails: {
        accountHolderName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        branchName: String
    },
    // paymentPreferences: { type: String, enum: ["weekly", "biweekly", "monthly"], default: "monthly" },

    // Document Uploads
    documents: {
        panCard: String,                // file path or cloud URL
        gstCertificate: String,
        businessRegistration: String,
        addressProof: String,
        bankProof: String,
        tradeLicense: String,
        ownerIdProof: String,
        importExportCode: String,
        productCertificates: [String]
    },

    // Verification Info
    verification: {
        kycStatus: { type: String, enum: ["pending", "inReview", "approved", "rejected"], default: "pending" },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin who verified
        verifiedAt: Date,
        rejectionReason: String
    },

    // Store Info
    store: {
        name: String,
        logo: String,
        description: String,
        policies: {
            shippingPolicy: String,
            returnPolicy: String,
            privacyPolicy: String
        }
    },

    categoriesAllowed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    rating: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 }
});

module.exports = mongoose.model("Vendor", VendorSchema);
