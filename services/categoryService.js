
const sharp = require('sharp');
const { randomUUID } = require('crypto');
const asyncHandler = require('express-async-handler');

const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');
const Category = require('../models/categoryModel');

// Upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${randomUUID()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);

    req.body.image = filename;
  }

  next();
});

// Get list of categories
exports.getCategories = factory.getAll(Category);

// Get specific category
exports.getCategory = factory.getOne(Category);

// Create category
exports.createCategory = factory.createOne(Category);

// Update category
exports.updateCategory = factory.updateOne(Category);

// Delete category
exports.deleteCategory = factory.deleteOne(Category);
