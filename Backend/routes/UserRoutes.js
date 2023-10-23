const express = require("express");
const {
  signUp,
  login,
  updateProfile,
  getProfile,
  uploadProfilePic,
  getCustomers,
  deleteProfile,
} = require("../controllers/UserController");
const Authentication = require("../middleware/Authentication");
const router = express.Router();

router.post("/login", login);
router.post("/", signUp);
router.put("/profile/edit", Authentication, updateProfile);
router.get("/profile/:id", getProfile);
router.put("/profileimage", Authentication, uploadProfilePic);
router.get("/customers", getCustomers);
router.delete("/delete", deleteProfile);

module.exports = router;
