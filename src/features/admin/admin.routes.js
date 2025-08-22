const express = require('express');
const router = express.Router();
const adminController = require("./admin.controller");
const Upload = require("../../middlewares/upload");

router.get('/vendors/pending', adminController.getPendingVendors);
router.get('/vendors', adminController.getVendors);
router
    .route('/vendors/:vendorID')
    .get(adminController.getVendorById)
    .delete(adminController.deleteVendor);

router.post('/vendors/:vendorID/status', adminController.changeKycStatus);


//category 


router.post("/categories", Upload.fields([
    { name: "categoryImage", maxCount: 1 },
]), adminController.createCategory);
router.get("/categories", adminController.getAllCategories);
router
    .route("/categories/:categoryID")
    .get(adminController.getCategoryById)
    .put(Upload.fields([{ name: "categoryImage", maxCount: 1 }]), adminController.updateCategory)
    .delete(adminController.deleteCategory);



//products

module.exports = router;