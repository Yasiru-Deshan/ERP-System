const express = require("express");
const {
  getInventories,
  getInventoryById,
  addToCart,
  getCartItems,
  removeCartItem,
} = require("../controllers/InventoryController");
const Authentication = require("../middleware/Authentication");
const router = express.Router();

router.get("/all", getInventories);
router.get("/:id", getInventoryById);
router.put("/add_to_cart", Authentication, addToCart);
router.get("/", Authentication, getCartItems);
router.put("/remove_item", Authentication, removeCartItem);

module.exports = router;
