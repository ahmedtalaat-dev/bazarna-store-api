const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const Category = require("../models/categoryModel");

// Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// Resize image and upload to Cloudinary
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const buffer = await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toBuffer();

  const result = await uploadToCloudinary(buffer, {
    folder: "bazarna/categories",
  });

  // Save the Cloudinary URL in MongoDB
  req.body.image = result.secure_url;

  next();
});

// CRUD operations
exports.getCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
