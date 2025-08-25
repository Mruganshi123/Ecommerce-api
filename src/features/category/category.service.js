const ApiError = require("../../utils/ApiError");
const Category = require("./category.model");
const { setCache, getCache, deleteCache } = require("../../utils/cache");

exports.create = async (req) => {

    const categoryData = { name, slug, description, parentCategory, metaTitle, metaDescription, metaKeywords } = req.body

    categoryData.categoryImage = req.files?.categoryImage?.[0]?.path || null;
    categoryData.createdBy = req.user.id;


    const category = await Category.create(categoryData);
    const populatedCategory = await Category.findById(category._id)
        .populate("parentCategory");

    return populatedCategory;
    // return category;
}

exports.getAll = async () => {
    const cacheKey = "allCategories";
    let categories = getCache(cacheKey);

    if (!categories) {
        categories = await Category.find({}).populate('parentCategory');
        setCache(cacheKey, categories);
    }
    return categories;
}


exports.getById = async (req) => {
    const categoryID = req.params.categoryID;
    const cacheKey = `category_${categoryID}`;
    let category = getCache(cacheKey);

    if (!category) {
        category = await Category.findById({ _id: categoryID }).populate('parentCategory');
        if (!category) {
            throw new ApiError("category not found", 404);
        }
        setCache(cacheKey, category);
    }
    return category;
}

exports.update = async (req) => {
    deleteCache("allCategories");
    deleteCache(`category_${req.params.categoryID}`);
    const updateData = { ...req.body };

    if (req.files?.categoryImage?.[0]?.path) {
        updateData.categoryImage = req.files.categoryImage[0].path;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.categoryID,
        { $set: updateData },
        { new: true }
    ).populate("parentCategory");
    if (!updatedCategory) {
        throw new ApiError("category not found", 404);
    }
    return updatedCategory;
}


exports.delete = async (req) => {

    deleteCache("allCategories");
    deleteCache(`category_${req.params.categoryID}`);
    const category = await Category.findByIdAndDelete(req.params.categoryID);
    if (!category) {
        throw new ApiError("category not found", 404);
    }

    return category;
}