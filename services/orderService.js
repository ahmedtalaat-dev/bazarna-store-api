const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

// @desc    Create cash order
// @route   POST /api/v1/orders/:cartId
// @access  Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // App settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404),
    );
  }

  // 2) Calculate order price
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order (Cash on Delivery)
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
    paymentMethodType: "cash",
  });

  // 4) Update product quantities and sold count
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: {
            quantity: -item.quantity,
            sold: item.quantity,
          },
        },
      },
    }));

    await Product.bulkWrite(bulkOption);

    // 5) Clear cart
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({
    status: "success",
    data: order,
  });
});

// @desc    Filter orders for logged-in user
// @access  Protected/User-Admin-Manager
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }

  next();
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.findAllOrders = factory.getAll(Order);

// @desc    Get specific order
// @route   GET /api/v1/orders/:id
// @access  Protected/User-Admin-Manager
exports.findSpecificOrder = factory.getOne(Order);

// @desc    Update order paid status
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(
        `There is no such an order with this id: ${req.params.id}`,
        404,
      ),
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

// @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(
        `There is no such an order with this id: ${req.params.id}`,
        404,
      ),
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});
