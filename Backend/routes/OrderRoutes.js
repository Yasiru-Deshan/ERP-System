const express = require("express");
const {
  createOrder,
  myOrders,
  updateOrder,
  getOrderById,
  customerOrders,
} = require("../controllers/OrderController");
const Authentication = require("../middleware/Authentication");
const router = express.Router();

router.post("/new_order", Authentication, createOrder);
router.get("/all", Authentication, myOrders);
router.put("/update_order", Authentication, updateOrder);
router.get("/:id", Authentication, getOrderById);
router.get("/customer_orders/:id", Authentication, customerOrders);

module.exports = router;
