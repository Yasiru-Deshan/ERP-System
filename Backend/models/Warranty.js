const mongoose = require("mongoose");

const WarrantySchema = mongoose.Schema({
  cus_name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cus_mobile: {
    type: Number,
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
  },
  error_type: {
    type: String,
  },
  error_description: {
    type: String,
  },
  job_type: {
    type: String,
  },
  status: {
    type: String,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Warranty", WarrantySchema);
