const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//signup
const signUp = async (req, res, next) => {
  const {
        email,
        password,
        firstName,
        lastName,
        mobile,
        city,
        zip
  } = req.body;

  let user;
  try {
    user = new User({
        email,
        password,
        firstName,
        lastName,
        mobile,
        city,
        zip,
      role: "user",
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const data = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(data, "erp", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        token,
        name: firstName,
        id: user.id,
        role: user.role,
      });
    });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

//login
const login = async (req, res, next) => {
  ("login");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "No user found for this email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "Email and password does not match",
      });
    }
    const data = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    user.password = undefined;
    jwt.sign(data, "erp", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        role: user.role,
        user: user,
      });
    });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

//update profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.id);

    await user.updateOne({ $set: req.body });
    res.status(200).json("Profile has been updated");
  } catch (err) {
    res.status(500).json(err);
  }
};

//getprofile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

//deleteprofile
const deleteProfile = async (req, res, next) => {

    const userId = req.body.id;

    try {
      const deletedUser = await User.findByIdAndRemove(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting user" });
    }
};



const uploadProfilePic = async (req, res, next) => {
  const { image } = req.body;
  "uploading", image;
  const userId = req.user.id;
  try {
    let surgeUser = await User.findById(userId);
    surgeUser.image = image;
    await surgeUser.save();
    return res.status(200).json({ msg: "profile picture updated" });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).populate();

    return res.status(200).json({ msg: "user Found", users });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

exports.signUp = signUp;
exports.login = login;
exports.updateProfile = updateProfile;
exports.getProfile = getProfile;
exports.uploadProfilePic = uploadProfilePic;
exports.getCustomers = getCustomers;
exports.deleteProfile = deleteProfile;
