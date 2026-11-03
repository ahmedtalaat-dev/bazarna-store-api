const asyncHandler = require("express-async-handler");
const { randomUUID } = require("crypto");
const sharp = require("sharp");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const Brand = require("../models/brandModel");

// Upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filename = `brand-${randomUUID()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;

  next();
});

// CRUD operations
exports.getBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.createBrand = factory.createOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
