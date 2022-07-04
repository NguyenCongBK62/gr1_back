const express = require("express");
const router = require("express-promise-router")();
const fileUploader = require("../configs/cloudinary.config");
const adminController = require("../controllers/admin");
const passport = require("passport");
const passportConfig = require("../middlewares/userPassport");

router
  .route("/signin")
  .post(
    passport.authenticate("local", { session: false }),
    adminController.signIn,
  );

router
  .route("/cloudinary-upload")
  .post(fileUploader.single("file"), (req, res, next) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    res.json({ secure_url: req.file.path });
  });

router.route("/post-job").post((req, res) => adminController.postJob(req, res));

router
  .route("/companyprofile")
  .post((req, res) => adminController.updateCompanyProfile(req, res));
router
  .route("/getprofile")
  .post((req, res) => adminController.getProfile(req, res));
router
  .route("/getlistjob")
  .post((req, res) => adminController.getListJob(req, res));
router.route("/getjob").post((req, res) => adminController.getJob(req, res));
router
  .route("/deletejob")
  .post((req, res) => adminController.deleteJob(req, res));

module.exports = router;
