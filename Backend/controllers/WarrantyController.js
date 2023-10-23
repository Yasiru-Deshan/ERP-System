const User = require("../models/User");
const Warranty = require("../models/Warranty");

//signup
const backOfficeSignUp = async (req, res, next) => {
  const {
        email,
        password,
        firstName,
        lastName,
        mobile,
        city,
        zip,
        role,
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
        role,
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

//backOfficeLogin
const backOfficeLogin = async (req, res, next) => {
 
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

const createJob = async (req, res, next) => {
  try {
    const {
      cus_name,
      cus_mobile,
      device,
      error_type,
      error_description,
      job_type,
    } = req.body;

    const warranty = new Warranty({
      cus_name,
      cus_mobile,
      device,
      error_type,
      error_description,
      job_type,
      created_by : req.user.id,
      status: "pending",
    });

    await warranty.save();

    res.status(201).json({ msg: "Job created successfully", warranty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

//getJobs
const getJobs = async (req, res, next) => {
  try {
    const job = await Warranty.find();

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json(err);
  }
};

//update job
const updateJob = async (req, res, next) => {
  try {
    const job = await Warranty.findById(req.body.id);

    await job.updateOne({ $set: req.body });
    res.status(200).json("Job has been updated");
  } catch (err) {
    res.status(500).json(err);
  }
};

//deletejob
const deleteJob = async (req, res, next) => {

    const jobId = req.body.id;

    try {
      const deletedJob = await Warranty.findByIdAndRemove(jobId);

      if (!deletedJob) {
        return res.status(404).json({ message: "Job not found" });
      }

      return res
        .status(200)
        .json({ message: "job deleted successfully"});
    } catch (error) {
      return res.status(500).json({ error: "Error deleting job" });
    }
};
 


exports.backOfficeSignUp = backOfficeSignUp;
exports.backOfficeLogin = backOfficeLogin;
exports.createJob = createJob;
exports.getJobs = getJobs;
exports.updateJob = updateJob;
exports.deleteJob = deleteJob;