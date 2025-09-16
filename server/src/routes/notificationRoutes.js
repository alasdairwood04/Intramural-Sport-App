const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.post('/notifications', isAuthenticated, isAdmin, notificationController.createNotification);
router.get('/users/:id/notifications', isAuthenticated, notificationController.getUserNotifications);
router.put('/notifications/:id/read', isAuthenticated, notificationController.markAsRead);

module.exports = router;