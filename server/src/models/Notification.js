const pool = require('../config/database');

const Notification = {
    async create(notificationData) {
        const { user_id, message } = notificationData;
        const { rows } = await pool.query(
            `INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *;`,
            [user_id, message]
        );
        return rows[0];
    },

    async getForUser(userId) {
        const { rows } = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC;',
            [userId]
        );
        return rows;
    },

    async markAsRead(id) {
        const { rows } = await pool.query(
            'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *;',
            [id]
        );
        return rows[0];
    }
};

module.exports = Notification;