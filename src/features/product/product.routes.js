
const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const allowedRoles = require("../../middlewares/allowedRoles.middleware");
const Upload = require("../../middlewares/upload");
const authorizeVariantAccess = require('../../middlewares/authorizeVariantAccess.middleware')
const { bulkUploadFile } = require("../../middlewares/csvUpload");

router.post("/", allowedRoles('vendor'),
    Upload.fields([
        { name: "productImages", maxCount: process.env.PRODUCT_IMAGES_MAX_COUNT },
    ]),
    productController.createProduct);

router.get("/", allowedRoles('admin', 'vendor'), productController.getAllProducts);
router
    .route("/:productID")
    .get(allowedRoles("admin", "vendor"), productController.getProductById)
    .put(
        allowedRoles("vendor"),
        Upload.fields([
            { name: "productImages", maxCount: process.env.PRODUCT_IMAGES_MAX_COUNT },
        ]),
        productController.updateProduct
    )
    .delete(allowedRoles("admin", "vendor"), productController.deleteProduct);

router.put(
    "/:productID/status",
    allowedRoles("admin", "vendor"),
    productController.changeProductStatus
);

router.put(
    "/:productID/stock",
    allowedRoles("vendor"),
    productController.updateProductStock
);

//variants

router.post(
    "/:productID/variants",
    allowedRoles("vendor"),
    Upload.fields([
        {
            name: "variantImages",
            maxCount: process.env.VARIANT_IMAGES_MAX_COUNT,
        },
    ]),
    productController.createProductVariants
);
router.get("/:productID/variants", allowedRoles('vendor', 'admin'), productController.getAllProductVariants);
router.put("/:productID/variants/:variantID", allowedRoles('vendor'), authorizeVariantAccess, Upload.fields([
    {
        name: "variantImages",
        maxCount: process.env.VARIANT_IMAGES_MAX_COUNT,
    },
]), productController.updateProductVariant);
router.delete("/:productID/variants/:variantID", allowedRoles('vendor', 'admin'), authorizeVariantAccess, productController.deleteProductVariant);
router.get("/:productID/variants/:variantID", allowedRoles('vendor'), authorizeVariantAccess, productController.getProductVariant);



router.post(
    "/bulkUpload",
    allowedRoles("vendor"),
    bulkUploadFile.single("csvFile"),
    productController.bulkUpload
);
module.exports = router;