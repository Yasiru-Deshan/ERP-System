const express = require("express");
const {
  createJob,
  backOfficeSignUp,
  backOfficeLogin,
  getJobs,
  updateJob,
  deleteJob,
} = require("../controllers/WarrantyController");
const ServiceManagerAuthentication = require("../middleware/ServiceManagerAuthentication");
const ServiceRepresentiveAuthentication = require("../middleware/ServiceRepresentiveAuthentication");
const router = express.Router();

router.post("/login", backOfficeLogin);
router.post("/signup", backOfficeSignUp);
router.post("/new", ServiceRepresentiveAuthentication, createJob);
router.get("/", getJobs);
router.put("/edit", ServiceManagerAuthentication, updateJob);
router.delete("/delete",  deleteJob);

module.exports = router;
