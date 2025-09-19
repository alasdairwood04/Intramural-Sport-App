const pool = require('../config/database');

const Teamsheet = {
    async create(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const teamsheetResult = await client.query(
                `INSERT INTO teamsheets (fixture_id, team_id) VALUES ($1, $2) RETURNING id`,
                [data.fixture_id, data.team_id]
            );
            const teamsheetId = teamsheetResult.rows[0].id;

            if (data.player_ids && data.player_ids.length > 0) {
                const playerValues = data.player_ids.map((_, index) => `($1, $${index + 2})`).join(', ');
                const queryParams = [teamsheetId, ...data.player_ids];
                await client.query(`INSERT INTO teamsheet_players (teamsheet_id, player_id) VALUES ${playerValues}`, queryParams);
            }
            await client.query('COMMIT');
            return await this.get(data.fixture_id, data.team_id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async update(fixtureId, teamId, data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const teamsheetResult = await client.query(
                `SELECT id FROM teamsheets WHERE fixture_id = $1 AND team_id = $2`,
                [fixtureId, teamId]
            );

            if (teamsheetResult.rows.length === 0) {
                throw new Error('Teamsheet not found to update.');
            }
            const teamsheetId = teamsheetResult.rows[0].id;
            
            await client.query(`UPDATE teamsheets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [teamsheetId]);
            await client.query(`DELETE FROM teamsheet_players WHERE teamsheet_id = $1`, [teamsheetId]);

            if (data.player_ids && data.player_ids.length > 0) {
                const playerValues = data.player_ids.map((_, index) => `($1, $${index + 2})`).join(', ');
                const queryParams = [teamsheetId, ...data.player_ids];
                await client.query(`INSERT INTO teamsheet_players (teamsheet_id, player_id) VALUES ${playerValues}`, queryParams);
            }
            
            await client.query('COMMIT');
            return await this.get(fixtureId, teamId);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
    
    async get(fixtureId, teamId) {
        // Get the teamsheet
        const teamsheetResult = await pool.query(
            `SELECT ts.id, ts.fixture_id, ts.team_id, ts.created_at, ts.updated_at
             FROM teamsheets ts
             WHERE ts.fixture_id = $1 AND ts.team_id = $2`,
            [fixtureId, teamId]
        );
        
        if (teamsheetResult.rows.length === 0) {
            return null;
        }
        
        const teamsheet = teamsheetResult.rows[0];
        
        // Get the players
        const playersResult = await pool.query(
            `SELECT tp.player_id, tp.position, tp.is_starter,
                    u.first_name, u.last_name, u.email
             FROM teamsheet_players tp
             JOIN users u ON tp.player_id = u.id
             WHERE tp.teamsheet_id = $1
             ORDER BY tp.is_starter DESC, u.last_name, u.first_name`,
            [teamsheet.id]
        );
        
        // Add players to the teamsheet
        teamsheet.players = playersResult.rows;
        
        return teamsheet;
    },
    
    /**
     * Check if a player is on a teamsheet
     * @param {UUID} fixtureId - Fixture ID
     * @param {UUID} playerId - Player ID
     */
    async isPlayerOnTeamsheet(fixtureId, playerId) {
        const result = await pool.query(
            `SELECT 1 FROM teamsheets ts
             JOIN teamsheet_players tp ON ts.id = tp.teamsheet_id
             WHERE ts.fixture_id = $1 AND tp.player_id = $2
             LIMIT 1`,
            [fixtureId, playerId]
        );
        
        return result.rows.length > 0;
    }
};

module.exports = Teamsheet;