const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users/me (get current user profile)
router.get('/me', userController.getCurrentUserProfile);

// PUT /api/users/me (update current user first name, last name, email)
router.put('/me', userController.updateCurrentUserProfile);

// PUT /api/users/me/password (change current user password)
router.put('/me/password', userController.changeCurrentUserPassword);

module.exports = router;