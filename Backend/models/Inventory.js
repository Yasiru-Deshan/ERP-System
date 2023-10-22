const mongoose = require("mongoose");

const InventorySchema = mongoose.Schema({
  inv_pro_name: {
    type: String,
    require: true,
  },
  inv_pro_description: {
    type: String,
    require: true,
  },
  inv_pro_cost: {
    type: Number,
    require: true,
  },
  inv_pro_selling: {
    type: Number,
    require: true,
  },
  inv_pro_warranty: {
    type: Number,
    require: true,
  },
  inv_pro_quantity: {
    type: Number,
    require: true,
  },
  inv_pro_reorder_level: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Inventory", InventorySchema);
