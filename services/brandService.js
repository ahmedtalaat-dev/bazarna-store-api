const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const Brand = require("../models/brandModel");

// Upload single image
exports.uploadBrandImage = uploadSingleImage("image");

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
    folder: "bazarna/brands",
  });

  // Save the Cloudinary URL in MongoDB
  req.body.image = result.secure_url;

  next();
});

// CRUD operations
exports.getBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.createBrand = factory.createOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
