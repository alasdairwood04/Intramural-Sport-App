const User = require('../models/User');

// Get current user profile
exports.getCurrentUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID from req.user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// Update current user profile
exports.updateCurrentUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, email } = req.body;

        const updatedUser = await User.update(userId, { firstName, lastName, email });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

// Change current user password
exports.changeCurrentUserPassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const isValid = await User.verifyPassword(userId, currentPassword);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid current password' });
        }

        await User.updatePassword(userId, newPassword);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};