const User = require("./user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;


module.exports = function (passport) {
  passport.use(
    new localStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, //by default usernameField: username & passwordField: password
      (email, password, done) => {
        User.findOne({ email: email }, (err, user) => {
          console.log(user);
          if (err) throw err;
          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      })
  );

  passport.serializeUser((user, cb) => {
    // cb(null, user.id);
    cb(null, user.id);

  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      console.log(user);
      const userInformation = {
        email: user.email,
      };
      cb(err, userInformation);
    });
  });
};