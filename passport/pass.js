const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport')
// Load User model
const User = require('../Schema/user');

passport.use(
  new LocalStrategy({ usernameField: 'email' },
    (email, password, done) => {
      //  Search For Match user
      User.findOne({ email: email }).then(user => {
        if (!user) {
          console.log("That email is not registered")
          return done(null, false, { message: 'That email is not registered' });
        }
        // Compare the Two Password password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          // if (err) throw err;
          if (err) {
            console.log(err)
            return done(err);
          }
          if (isMatch) {
            console.log("matching email");
            return done(null, user);
          } else {
            console.log("Password incorrect");
            return done(null, false, { message: 'Password incorrect' });

          }
        });
      });
    })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;