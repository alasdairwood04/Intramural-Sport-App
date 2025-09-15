// src/config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // We use our new model

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // 1. Find the user by their email
        const user = await User.findByEmail(email);
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // 2. Compare the submitted password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) {
          return done(null, user); // Pass the user object to the next step
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  // This saves the user's ID to the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // This retrieves the user's data from the database on each request
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};