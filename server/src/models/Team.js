const pool = require('../config/database');

const Team = {
    // Find a team by its ID
    async findById(id) {
        const { rows } = await pool.query("SELECT * FROM teams WHERE id = $1", [id]);
        return rows[0];
    },

    async create(teamData) { // using a transaction to ensure all steps complete successfully
        const { name, sportName, seasonName, userId } = teamData;
        const client = await pool.connect(); // Get a client from the pool for the transaction

        try {
            await client.query('BEGIN'); // Start the transaction

            // 1. Find sport_id and season_id
            const sportRes = await client.query("SELECT id FROM sports WHERE name = $1", [sportName]);
            if (sportRes.rows.length === 0) throw new Error('Sport not found');
            const sportId = sportRes.rows[0].id;

            const seasonRes = await client.query("SELECT id FROM seasons WHERE name = $1", [seasonName]);
            if (seasonRes.rows.length === 0) throw new Error('Season not found');
            const seasonId = seasonRes.rows[0].id;
            
            // 2. Check if the user is already a captain of another team in the same sport/season
            const existingTeamRes = await client.query(
                `SELECT id FROM teams WHERE captain_id = $1 AND sport_id = $2 AND season_id = $3`,
                [userId, sportId, seasonId]
            );
            if (existingTeamRes.rows.length > 0) {
                throw new Error('You are already the captain of a team in this sport for this season.');
            }

            // 3. Create the new team
            const teamResult = await client.query(
                `INSERT INTO teams (name, sport_id, season_id, captain_id)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *;`,
                [name, sportId, seasonId, userId]
            );
            const newTeam = teamResult.rows[0];

            // 4. Update user's role to 'captain' ONLY if they are currently a 'player'
            await client.query(
                "UPDATE users SET role = 'captain' WHERE id = $1 AND role = 'player'",
                [userId]
            );

            // 5. Automatically add the captain to the team_members table
            await client.query(
                `INSERT INTO team_members (team_id, user_id, role)
                 VALUES ($1, $2, 'captain');`,
                [newTeam.id, userId]
            );

            await client.query('COMMIT'); // Commit the transaction
            return newTeam;

        } catch (error) {
            await client.query('ROLLBACK'); // Roll back the transaction in case of an error
            console.error('Error creating team:', error);
            // Re-throw the error to be handled by the controller
            throw error; 
        } finally {
            client.release(); // Release the client back to the pool
        }
    },

    async getMembers(teamId) {
        const { rows } = await pool.query(
            `SELECT u.id, u.first_name, u.last_name, u.email, tm.role
             FROM users u
             JOIN team_members tm ON u.id = tm.user_id
             WHERE tm.team_id = $1`,
            [teamId]
        );
        return rows;
    },

    async addMember(teamId, userId, role = 'player') {
        const { rows } = await pool.query(
            `INSERT INTO team_members (team_id, user_id, role)
             VALUES ($1, $2, $3)
             RETURNING *;`,
            [teamId, userId, role]
        );
        return rows[0];
    },

    async removeMember(teamId, userId) {
        await pool.query(
            `DELETE FROM team_members
             WHERE team_id = $1 AND user_id = $2;`,
            [teamId, userId]
        );
    },

    async isUserCaptain(teamId, userId) {
        const { rows } = await pool.query(
            `SELECT * FROM teams
                WHERE id = $1 AND captain_id = $2;`,
            [teamId, userId]
        );
        return rows[0] !== undefined;
    },

    async isUserMember(teamId, userId) {
        const { rows } = await pool.query(
            `SELECT * FROM team_members
                WHERE team_id = $1 AND user_id = $2;`,
            [teamId, userId]
        );
        return rows[0] !== undefined;
    },

    async getUserTeams(userId) {
    const result = await pool.query(
    `SELECT t.*, s.name as sport_name, se.name as season_name,
        tm.role as user_role
      FROM teams t
      JOIN sports s ON t.sport_id = s.id
      JOIN seasons se ON t.season_id = se.id
      JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = $1 AND tm.is_active = true
      ORDER BY t.created_at DESC
    `, [userId]);
    return result.rows;
  }
            
};

module.exports = Team;