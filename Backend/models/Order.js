const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
    },
  ],
  price: {
    type: Number,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  status: {
    type: String,
    default: "pending",
  },
});

module.exports = mongoose.model("Order", OrderSchema);
