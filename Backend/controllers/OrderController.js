const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const User = require("../models/User");

const createOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const cartItemIds = user.cartItems;

    const cartItems = await Inventory.find({
      _id: { $in: cartItemIds },
    });

    const totalPrice = cartItems.reduce((total, cartItem) => {
      return total + cartItem.inv_pro_selling;
    }, 0);

    const order = new Order({
      orderItems: cartItems,
      price: totalPrice,
      user: req.user.id,
    });

    await order.save();

    user.cartItems = [];
    user.orders.push(order);

    await user.save();

    return res.status(200).json({ msg: "Order created", order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const myOrders = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    await user.populate({
      path: 'orders',
      populate: {
        path: 'orderItems',
      },
    });
    const orders = user.orders;

    return res.status(200).json({ msg: "Orders Found", orders });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

const customerOrders = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    await user.populate({
      path: "orders",
      populate: {
        path: "orderItems",
      },
    });
    const orders = user.orders;

    return res.status(200).json({ msg: "Orders Found", orders });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const order = await Order.findById(req.body.orderId);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (String(order.user) !== String(user._id)) {
      return res
        .status(403)
        .json({ msg: "Unauthorized: You can't update this order" });
    }

    order.status = req.body.status;

    await order.save();

    return res
      .status(200)
      .json({ msg: "Order status updated successfully", updatedOrder: order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.createOrder = createOrder;
exports.myOrders = myOrders;
exports.updateOrder = updateOrder;
exports.getOrderById = getOrderById;
exports.customerOrders = customerOrders;
