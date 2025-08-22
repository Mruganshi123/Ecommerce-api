const ApiError = require("../../utils/ApiError");
const Category = require("./category.model");

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
    const categories = await Category.find({}).populate('parentCategory');
    return categories;
}


exports.getById = async (req) => {
    const categories = await Category.findById({ _id: req.params.categoryID }).populate('parentCategory');
    if (!categories) {
        throw new ApiError("category not found", 404);
    }
    return categories;
}

exports.update = async (req) => {
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

    const category = await Category.findByIdAndDelete(req.params.categoryID);
    if (!category) {
        throw new ApiError("category not found", 404);
    }

    return category;
}