const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const SubCategory = require("../models/subCategoryModel");

// set categoryId to body
const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// create subcategory
const createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

// create filter object for get all subcategories
const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// get all subcategories
const getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategory.find(req.filterObj)
    .skip(skip)
    .limit(limit);
  // .populate({ path: 'category', select: 'name -_id' });

  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

// get specific subcategory
const getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);

  if (!subCategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// update specific subcategory
const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true },
  );

  if (!subCategory) {
    return next(new ApiError(`No  subcategory for this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// delete specific subcategory
const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }
  res.status(204).send();
});

module.exports = {
  setCategoryIdToBody,
  createFilterObj,
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
