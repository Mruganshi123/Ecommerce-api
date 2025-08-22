const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    sku: { type: String, required: true, unique: true },
    attributes: [
        {
            name: { type: String, required: true }, // e.g., "Color", "Size"
            value: { type: String, required: true } // e.g., "Red", "M"
        }
    ],
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, default: 0 },
    variantImages: [String],
    status: { type: String, enum: ["active", "inactive", "out-of-stock"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Variant", variantSchema);
