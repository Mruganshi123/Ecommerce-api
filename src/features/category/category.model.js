const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null, // null means it's a main category
        },
        categoryImage: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        metaTitle: {
            type: String,
            trim: true,
        },
        metaDescription: {
            type: String,
            trim: true,
        },
        metaKeywords: [
            {
                type: String,
                trim: true,
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Admin or Vendor who created it
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
