const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");
const db = require("../databaseConfig");
const jwtStrategy = require("passport-jwt").Strategy;
const localStraegy = require("passport-local").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { JWT_SECRET } = require("../configs");

passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const account = await db
          .select("*")
          .from("account")
          .where("id", "=", payload.sub);
        if (!account[0]) return done(null, false);
        done(null, account[0]);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

passport.use(
  new localStraegy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const account = await db
          .select("*")
          .from("account")
          .where("email", "=", email);
        if (!account[0]) return done(null, false);

        const isValid = bcrypt.compareSync(password, account[0].password);

        if (!isValid) return done(null, false);

        done(null, account[0]);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);
