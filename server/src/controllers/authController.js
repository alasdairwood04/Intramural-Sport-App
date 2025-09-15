const User = require('../models/User'); // We use our new model
const passport = require('passport');

// Register a new user
exports.register = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' }); // Changed to 500 for server errors
    }
};


// Login an existing user
exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Pass errors to the global error handler
        }
        if (!user) {
            return res.status(401).json({ error: info.message });
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ success: true, user });
        });
    })(req, res, next);
}

// Logout the current user
exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
}