const pool = require('../config/database');
const { findById } = require('./Team');

const Fixture = {
    async create(fixtureData) {
        const { seasonId, sportId, homeTeamId, awayTeamId, fixtureDate } = fixtureData;
        const { rows } = await pool.query(
            `INSERT INTO fixtures (season_id, sport_id, home_team_id, away_team_id, fixture_date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *;`,
            [seasonId, sportId, homeTeamId, awayTeamId, fixtureDate]
        );
        return rows[0];
    },

    async findAll() {
        const { rows } = await pool.query("SELECT * FROM fixtures");
        return rows;
    },

    async findById(id) {
        const { rows } = await pool.query("SELECT * FROM fixtures WHERE id = $1", [id]);
        return rows[0];
    },

    async submitResult(id, resultData) {
        const { homeTeamScore, awayTeamScore } = resultData;
        const { rows } = await pool.query(
            `UPDATE fixtures
             SET home_team_score = $1, away_team_score = $2, status = 'completed', updated_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *;`,
            [homeTeamScore, awayTeamScore, id]
        );
        return rows[0];
    }
};


module.exports = Fixture;