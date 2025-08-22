const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const nameMap = {
            gstCertificate: "gst_certificate",
            panCard: "pan_card",
            businessRegistration: "business_registration",
            addressProof: "address_proof",
            bankProof: "bank_proof",
            tradeLicense: "trade_license",
            ownerIdProof: "owner_id_proof",
            logo: "store_logo",
            CategoryImage: "category_image"
        };

        const customName = nameMap[file.fieldname] || file.fieldname;

        // Default folder
        let folderPath = "ecommerce/misc";
        // Default resource type
        let resourceType = "image";
        // File extension for format hint
        const fileExt = (file.originalname || "")
            .slice((file.originalname || "").lastIndexOf(".") + 1)
            .toLowerCase();

        // Decide folder based on route
        if (req.originalUrl.includes("/vendor")) {
            folderPath = "ecommerce/vendor";
        } else if (req.originalUrl.includes("/categories")) {
            // Optional: create subfolder based on category name from body or params
            const categoryName = (req.body.name || req.params.categoryName || "uncategorized")
                .replace(/\s+/g, "_")
                .toLowerCase();
            folderPath = `ecommerce/category/${categoryName}`;
        } else if (req.originalUrl.includes("/products")) {
            const productName = (req.body.name || req.params.productName || "uncategorized")
                .replace(/\s+/g, "_")
                .toLowerCase();
            folderPath = `ecommerce/product/${productName}`;
        } else if (req.originalUrl.includes("/bulkUpload")) {
            const vendorName = (req.user.id || "uncategorized")
                .replace(/\s+/g, "_")
                .toLowerCase();
            folderPath = `ecommerce/product/bulkUpload/${vendorName}`;
            // Bulk upload uses non-image files (csv/xlsx)
            resourceType = "raw";
        }

        return {
            folder: folderPath,
            public_id: `${customName}_${Date.now()}`,
            resource_type: resourceType,
            // Help Cloudinary keep the right extension for raw uploads
            format: resourceType === "raw" ? fileExt : undefined,
        };
    },
});


const Upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    fileFilter: (req, file, cb) => {
        // Bulk upload route check
        if (req.originalUrl.includes("/bulkUpload")) {
            const allowedMimeTypes = [
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                "application/vnd.ms-excel", // .xls, .csv (sometimes)
                "text/csv"
            ];
            const allowedExtensions = [".xlsx", ".csv"];
            const fileExt = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();

            if (
                allowedMimeTypes.includes(file.mimetype) ||
                allowedExtensions.includes(fileExt)
            ) {
                cb(null, true);
            } else {
                cb(new Error("Only CSV files are allowed for bulk upload"), false);
            }
        } else {
            // For images, allow jpg/png/jpeg
            if (file.mimetype.startsWith("image/")) {
                cb(null, true);
            } else {
                cb(new Error("Only images are allowed"), false);
            }
        }
    },
});


module.exports = Upload;
