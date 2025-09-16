const pool = require('../config/database');

const Teamsheet = {
    // Submit a teamsheet for a fixture
    async submit(teamsheetData) {
        const { fixture_id, team_id, player_ids } = teamsheetData;
        const { rows } = await pool.query(
            `INSERT INTO teamsheets (fixture_id, team_id, player_ids)
             VALUES ($1, $2, $3)
             RETURNING *;`,
            [fixture_id, team_id, player_ids]
        );
        return rows[0];
    },

    // Get teamsheet by fixture_id and team_id
    async get(fixture_id, team_id) {
        const { rows } = await pool.query(
            'SELECT * FROM teamsheets WHERE fixture_id = $1 AND team_id = $2;',
            [fixture_id, team_id]
        );
        return rows[0];
    }
};

module.exports = Teamsheet;