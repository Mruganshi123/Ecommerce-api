// upload.js - for bulkUpload route only
const multer = require("multer");
const path = require("path");
const os = require("os");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, os.tmpdir()); // Save to temp dir
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const bulkUploadFile = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = [".xlsx", ".csv"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
            return cb(new Error("Only CSV/XLSX files allowed"));
        }
        cb(null, true);
    }
});

module.exports = { bulkUploadFile };
