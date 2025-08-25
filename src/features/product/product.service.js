const Product = require("./product.model")
const Role = require("../role/role.model");
const ApiError = require("../../utils/ApiError");
const papaParse = require("papaparse")
const XLSX = require("xlsx")
const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require("axios");
const { setCache, getCache, deleteCache } = require("../../utils/cache");

exports.create = async (req) => {

    deleteCache("allProducts_admin");
    deleteCache(`allProducts_vendor_${req.user.id}`);
    const productData = {
        name,
        slug,
        description,
        price,
        discount,
        stock,
        sku,
        tags,
        isFeatured
    } = req.body
    productData.vendor = req.user.id;

    if (req.files.productImages) {
        productData.productImages = req.files.productImages.map(file => ({
            url: file.path || null,
            alt: productData.name
        }));
    }


    productData.shippingDetails = {
        weight: req.body.wight,
        dimensions: {
            length: req.body.length,
            height: req.body.height,
            width: req.body.width

        }
    }

    const product = await Product.create(productData);
    const populatedproduct = await Product.findById(product._id)
        .populate([{ path: "category" }, { path: 'vendor' }]);

    return populatedproduct;
    // return category;
}

exports.getAll = async (req) => {

    const userRole = await Role.findById(req.user.role).select('role')
    if (userRole.role === 'vendor') {
        const cacheKey = `allProducts_vendor_${req.user.id}`;
        let products = getCache(cacheKey);
        if (!products) {
            products = await Product.find({ vendor: req.user.id }).populate([{ path: "category" }, { path: 'vendor' }]);
            setCache(cacheKey, products);
        }
        return products;
    }
    else {
        const cacheKey = "allProducts_admin";
        let products = getCache(cacheKey);
        if (!products) {
            products = await Product.find({}).populate([{ path: "category" }, { path: 'vendor' }]);
            setCache(cacheKey, products);
        }
        return products;
    }
}


exports.getById = async (req) => {
    const productID = req.params.productID;
    const cacheKey = `product_${productID}`;
    let product = getCache(cacheKey);

    if (!product) {
        const userRole = await Role.findById(req.user.role).select('role')
        if (userRole.role === 'vendor') {
            product = await Product.find({ vendor: req.user.id }, { _id: productID }).populate([{ path: "category" }, { path: 'vendor' }, { path: 'variants' }]);
            if (!product) {
                throw new ApiError(404, "Product not found");
            }
        } else {
            product = await Product.findById(productID).populate([{ path: "category" }, { path: 'vendor' }, { path: 'variants' }]);
            if (!product) {
                throw new ApiError(404, "Product not found");
            }
        }
        setCache(cacheKey, product);
    }
    return product;
}

exports.update = async (req) => {
    deleteCache("allProducts_admin");
    deleteCache(`allProducts_vendor_${req.user.id}`);
    deleteCache(`product_${req.params.productID}`);
    const product = await Product.findById(req.params.productID);

    if (!product) {
        throw new ApiError("Product not found", 404);
    }

    if (product.vendor.toString() !== req.user.id) {
        throw new ApiError("You are not authorized to update this product", 403);
    }

    const updateData = { ...req.body };

    if (req.files?.productImages) {
        updateData.productImages = req.files.productImages.map(file => ({
            url: file.path || null,
            alt: updateData.name || product.name
        }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.productID,
        { $set: updateData },
        { new: true }
    ).populate([{ path: "category" }, { path: 'vendor' }]);

    return updatedProduct;
};

exports.delete = async (req) => {
    deleteCache("allProducts_admin");
    deleteCache(`allProducts_vendor_${req.user.id}`);
    deleteCache(`product_${req.params.productID}`);
    const product = await Product.findById(req.params.productID);

    if (!product) {
        throw new ApiError("Product not found", 404);
    }

    if (product.vendor.toString() !== req.user.id) {
        throw new ApiError("You are not authorized to delete this product", 403);
    }
    return await Product.findByIdAndDelete(req.params.productID);
}


exports.changeStatus = async (req) => {
    deleteCache("allProducts_admin");
    deleteCache(`allProducts_vendor_${req.user.id}`);
    deleteCache(`product_${req.params.productID}`);
    const { status } = req.body;
    const { productID } = req.params;

    const userRole = await Role.findById(req.user.role).select('role');

    let product;

    if (userRole.role === 'vendor') {
        product = await Product.findOne({ vendor: req.user.id, _id: productID });
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
    } else {
        product = await Product.findById(productID);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
    }

    await product.updateOne({ $set: { status } });
    return await Product.findById(productID); // return updated doc
};

exports.updateStock = async (req) => {
    deleteCache("allProducts_admin");
    deleteCache(`allProducts_vendor_${req.user.id}`);
    deleteCache(`product_${req.params.productID}`);
    const { productID } = req.params;
    const { stock } = req.body;
    const product = await Product.findById(productID);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    if (product.vendor.toString() !== req.user.id) {
        throw new ApiError(403, "You are not authorized to update this product");
    }
    console.log(product.vendor);

    await product.updateOne({ $set: { stock } });
    return await Product.findById(productID);
}

exports.bulkUpload = async (req) => {
    deleteCache("allProducts_admin");
    deleteCache(`allProducts_vendor_${req.user.id}`);
    if (!req.file) throw new ApiError(400, "No file uploaded");

    const tempPath = req.file.path;
    const extension = path.extname(tempPath).toLowerCase();

    let productData = [];

    if (extension === ".csv") {
        const fileData = fs.readFileSync(tempPath, "utf-8");
        const parsedData = papaParse.parse(fileData, { header: true });
        productData = parsedData.data;
    } else if (extension === ".xlsx") {
        const workBook = XLSX.readFile(tempPath);
        const sheetName = workBook.SheetNames[0];
        productData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
    }

    fs.unlinkSync(tempPath); // cleanup

    const mappedProducts = productData.map(p => ({
        vendor: req.user.id,
        category: p.category,
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        price: Number(p.price),
        discount: Number(p.discount),
        sku: p.sku,
        stock: Number(p.stock) || 0,
        shippingDetails: {
            weight: p.weight,
            dimensions: {
                length: Number(p.length),
                width: Number(p.width),
                height: Number(p.height)
            }
        },
        tags: p.tags ? p.tags.split(";") : [],
        isFeatured: p.isFeatured === "true" || p.isFeatured === true
    }));

    return await Product.insertMany(mappedProducts);
};


