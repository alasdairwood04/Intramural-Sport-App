const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const userController = require('../controllers/userController');

// GET /api/users/me (get current user profile)
router.get('/me', isAuthenticated, userController.getCurrentUserProfile);

// PUT /api/users/me (update current user first name, last name, email)
router.put('/me', isAuthenticated, userController.updateCurrentUserProfile);

// PUT /api/users/me/password (change current user password)
router.put('/me/password', isAuthenticated, userController.changeCurrentUserPassword);

module.exports = router;