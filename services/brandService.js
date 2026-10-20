const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Brand = require("../models/brandModel");

// get all brands
const getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const brands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});

// get specific brand
const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// create new brand
const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// update specific brand
const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true },
  );

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// delete specific brand
const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(204).send();
});

module.exports = {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
