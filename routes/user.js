const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/userPassport");
const UserController = require("../controllers/user");

router
  .route("/signin")
  .post(
    passport.authenticate("local", { session: false }),
    UserController.signIn,
  );

router.route("/signup").post(UserController.signUp);

router
  .route("/secret")
  .get(passport.authenticate("jwt", { session: false }), UserController.secret);

router
  .route("/auth/google")
  .post(
    passport.authenticate("google-token", { session: false }),
    UserController.authGoogle,
  );

router.route("/getListCompany").get((req, res) => {
  UserController.getListCompany(req, res);
});

router.route("/job").get((req, res) => UserController.listJob(req, res));

router
  .route("/getprofilecompany")
  .post((req, res) => UserController.getProfileCompany(req, res));

module.exports = router;
