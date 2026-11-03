const express = require("express");

const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

// Protect all order routes
router.use(authService.protect);

// Create cash order
router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);

// Get all orders
router.get(
  "/",
  authService.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  findAllOrders,
);

// Get specific order
router.get("/:id", findSpecificOrder);

// Update order paid status
router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  updateOrderToPaid,
);

// Update order delivered status
router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  updateOrderToDelivered,
);

module.exports = router;
