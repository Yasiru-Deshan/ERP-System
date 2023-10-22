const { get } = require("mongoose");
const Inventory = require("../models/Inventory");
const User = require("../models/User");

const getInventories = async (req, res, next) => {
  try {
    const inventories = await Inventory.find().populate();

    return res.status(200).json({ msg: "Inventories Found", inventories });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

const getInventoryById = async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.id);

    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.findById(req.body.inventoryItemId);

    if (!inventoryItem) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.cartItems.push(inventoryItem);

    await user.save();

    res.status(200).json("Item added to cart successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCartItems = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    await user.populate("cartItems");
    const cart_items = user.cartItems;

    return res.status(200).json({ msg: "Cart Items Found", cart_items });

  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

const removeCartItem = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const itemIdToRemove = req.body.itemIdToRemove;

        user.cartItems.pull(itemIdToRemove);

        await user.save();

        return res
        .status(200)
        .json({ msg: "Item removed from the cart successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
        msg: "Internal server error",
        });
    }
};

exports.getInventories = getInventories;
exports.getInventoryById = getInventoryById;
exports.addToCart = addToCart;
exports.getCartItems = getCartItems;
exports.removeCartItem = removeCartItem;

