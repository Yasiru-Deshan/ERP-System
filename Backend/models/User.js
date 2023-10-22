const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    default:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg",
  },
  password: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  mobile: {
    type: Number,
  },
  city: {
    type: String,
  },
  zip: {
    type: Number,
  },
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  role: {
    type: String,
    default: "user",
  },
});

module.exports = mongoose.model("User", UserSchema);
