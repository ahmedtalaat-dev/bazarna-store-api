const asyncHandler = require("express-async-handler");
const { randomUUID } = require("crypto");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");

const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const createToken = require("../utils/createToken");
const User = require("../models/userModel");

// Upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filename = `user-${randomUUID()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/users/${filename}`);

  req.body.profileImg = filename;

  next();
});

// Get list of users
exports.getUsers = factory.getAll(User);

// Get specific user
exports.getUser = factory.getOne(User);

// Create user
exports.createUser = factory.createOne(User);

// Update specific user
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

// Delete specific user
exports.deleteUser = factory.deleteOne(User);

// Get logged user data
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// Update logged user password
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// Update logged user data
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json({ data: updatedUser });
});

// Deactivate logged user
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "Success" });
});
