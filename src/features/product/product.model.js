const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        discount: {
            type: Number,
            default: 0, // Percentage discount
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        sku: {
            type: String,
            unique: true,
            uppercase: true,
        },
        productImages: [
            {
                url: { type: String },
                alt: { type: String },
            },
        ],
        status: {
            type: String,
            enum: ["active", "inactive", "out-of-stock"],
            default: "active",
        },
        shippingDetails: {
            weight: { type: Number }, // in kg
            dimensions: {
                length: { type: Number },
                width: { type: Number },
                height: { type: Number },
            },
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

productSchema.virtual('variants', {
    ref: 'Variant', // Model to populate
    localField: '_id', // Product _id
    foreignField: 'product' // Variant.product
});
productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model("Product", productSchema);
