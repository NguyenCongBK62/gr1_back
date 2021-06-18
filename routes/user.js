const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");
const UserController = require("../controllers/user");
const { session } = require("passport");

router
  .route("/signin")
  .post(
    passport.authenticate("local", { session: false }),
    UserController.signIn
  );

router.route("/signup").post(UserController.signUp);

router
  .route("/secret")
  .get(passport.authenticate("jwt", { session: false }), UserController.secret);

router
  .route("/auth/google")
  .post(
    passport.authenticate("google-token", { session: false }),
    UserController.authGoogle
  );

module.exports = router;
