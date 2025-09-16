const Notification = require('../models/Notification');

exports.createNotification = async (req, res, next) => {
    try {
        const newNotification = await Notification.create(req.body);
        res.status(201).json({ success: true, data: newNotification });
    } catch (error) {
        next(error);
    }
};

exports.getUserNotifications = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const notifications = await Notification.getForUser(userId);
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        next(error);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const notificationId = req.params.id;
        const updatedNotification = await Notification.markAsRead(notificationId);
        if (!updatedNotification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.status(200).json({ success: true, data: updatedNotification });
    } catch (error) {
        next(error);
    }
};