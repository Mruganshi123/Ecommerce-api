const express = require('express');
const router = express.Router();
const Upload = require("./../../middlewares/upload");
const vendorController = require("./vendor.controller");

router.post("/setUp", Upload.fields([
    { name: "panCard", maxCount: 1 },
    { name: "gstCertificate", maxCount: 1 },
    { name: "businessRegistration", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "bankProof", maxCount: 1 },
    { name: "tradeLicense", maxCount: 1 },
    { name: "ownerIdProof", maxCount: 1 },
    { name: "logo", maxCount: 1 }
]), vendorController.setUpVendorProfile);




//product 


module.exports = router;