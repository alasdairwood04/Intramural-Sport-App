const pool = require('../config/database');

const Availability = {
    // Mark availability for a user for a specific fixture
    async mark(availabilityData) {
        const { user_id, fixture_id, is_available } = availabilityData;
        const { rows } = await pool.query(
            `INSERT INTO availability (user_id, fixture_id, is_available)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, fixture_id) DO UPDATE SET is_available = $3, updated_at = CURRENT_TIMESTAMP 
             RETURNING *;`,
            [user_id, fixture_id, is_available]
        );
        return rows[0];
    },

    // Get availability for a specific fixture
    async getForFixture(fixtureId) {
        const { rows } = await pool.query(
            'SELECT u.id as user_id, u.first_name, u.last_name, a.is_available FROM availability a JOIN users u ON a.user_id = u.id WHERE a.fixture_id = $1;',
            [fixtureId]
        );
        return rows;
    },

    // Update availability by its ID
    async update(id, is_available) {
        const { rows } = await pool.query(
            'UPDATE availability SET is_available = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;',
            [is_available, id]
        );
        return rows[0];
    }
};

module.exports = Availability;