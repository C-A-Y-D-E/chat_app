const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/User.model");
exports.init = (passport) => {
  /**
   * This putting user id in database with session
   */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  /**
   * This will get userid from session and find user with it
   */
  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      const user = await User.findOne({ username }).select("+password");

      if (!user || !(await user.checkPassword(password, user.password))) {
        return done(new Error("Invalid Email and Password"));
      }
      user.password = undefined;
      return done(null, user);
    })
  );
};
