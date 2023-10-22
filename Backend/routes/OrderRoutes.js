const express = require("express");
const {
  createOrder,
  myOrders,
  updateOrder,
  getOrderById,
} = require("../controllers/OrderController");
const Authentication = require("../middleware/Authentication");
const router = express.Router();

router.post("/new_order", Authentication, createOrder);
router.get("/all", Authentication, myOrders);
router.put("/update_order", Authentication, updateOrder);
router.get("/:id", Authentication, getOrderById);

module.exports = router;
