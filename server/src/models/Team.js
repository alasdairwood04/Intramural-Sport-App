const pool = require('../config/database');
const { getAllTeams } = require('../controllers/teamController');

const Team = {
    // Find a team by its ID
    async findById(id) {
        const { rows } = await pool.query("SELECT * FROM teams WHERE id = $1", [id]);
        return rows[0];
    },

    async create(teamData) { // using a transaction to ensure all steps complete successfully
        const { name, sportName, seasonName, userId, isAdmin } = teamData;
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
            // Skip this check if the user is an admin
            if (!isAdmin) {
                const existingTeamRes = await client.query(
                    `SELECT id FROM teams WHERE captain_id = $1 AND sport_id = $2 AND season_id = $3`,
                    [userId, sportId, seasonId]
                );
                if (existingTeamRes.rows.length > 0) {
                    throw new Error('You are already the captain of a team in this sport for this season.');
                }
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

    async delete(id) {
        const { rowCount } = await pool.query("DELETE FROM teams WHERE id = $1", [id]);
        return rowCount > 0;
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
  },


async updateTeam(teamId, updateData) {
    // Define allowed fields to update
    const allowedFields = ['name', 'description', 'logo_url', 'is_active'];
    
    const fields = [];
    const values = [];
    let index = 1;
    
    // Only process fields that are in the allowed list
    for (const key in updateData) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${index}`);
        values.push(updateData[key]);
        index++;
      }
    }
    
    // If no valid fields to update, return the existing team
    if (fields.length === 0) {
      return await this.findById(teamId);
    }
    
    values.push(teamId); // For the WHERE clause
    const query = `UPDATE teams SET ${fields.join(', ')} WHERE id = $${index} RETURNING *;`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },



  // Delete a team by its ID
  async deleteTeam(teamId) {
    const { rowCount } = await pool.query(
      `DELETE FROM teams WHERE id = $1 RETURNING *;`,
      [teamId]
    );
    return rowCount > 0;
  },

  // Add this method to your Team object

    async isUserInAnotherTeamSameSeason(userId, seasonId, excludeTeamId) {
    const { rows } = await pool.query(
        `SELECT t.id 
        FROM teams t
        JOIN team_members tm ON t.id = tm.team_id
        WHERE tm.user_id = $1
        AND t.season_id = $2
        AND t.id != $3
        LIMIT 1`,
        [userId, seasonId, excludeTeamId]
    );
    
    return rows.length > 0;
    },

    async getAllTeams() {
        const { rows } = await pool.query(
            // You can expand this query to include joins with sports and seasons if needed
            `SELECT t.*, s.name as sport_name, se.name as season_name
             FROM teams t
             JOIN sports s ON t.sport_id = s.id
             JOIN seasons se ON t.season_id = se.id
             ORDER BY t.created_at DESC`
        );
        return rows;
    },

// ==== Team Join Requests ====

    // Create a request for a user to join a team
    async createJoinRequest(teamId, userId) {
        const { rows } = await pool.query(
        `INSERT INTO join_requests (team_id, user_id) VALUES ($1, $2) RETURNING *;`,
        [teamId, userId]
        );
        return rows[0];
    },

    // Get all pending join requests for a specific team
    async getTeamJoinRequests(teamId) {
        const { rows } = await pool.query(
        `SELECT jr.id, jr.status, u.id as user_id, u.first_name, u.last_name, u.email
        FROM join_requests jr
        JOIN users u ON jr.user_id = u.id
        WHERE jr.team_id = $1 AND jr.status = 'pending'`,
        [teamId]
        );
        return rows;
    },

    // Approve a join request and add the user to the team (using a transaction)
    async approveJoinRequest(requestId) {
        const client = await pool.connect();
        try {
        await client.query('BEGIN');

        // 1. Get the user_id and team_id from the request
        const requestRes = await client.query('SELECT user_id, team_id FROM join_requests WHERE id = $1', [requestId]);
        if (requestRes.rows.length === 0) {
            throw new Error('Join request not found');
        }
        const { user_id, team_id } = requestRes.rows[0];

        // 2. Add the user to the team_members table
        await client.query('INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)', [team_id, user_id, 'player']);

        // 3. Update the request status to 'approved'
        const { rows } = await client.query(
            `UPDATE join_requests SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`,
            [requestId]
        );
        
        await client.query('COMMIT');
        return rows[0];

        } catch (error) {
        await client.query('ROLLBACK');
        throw error;
        } finally {
        client.release();
        }
    },

    // Reject a join request
    async rejectJoinRequest(requestId) {
        const { rows } = await pool.query(
        `UPDATE join_requests SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`,
        [requestId]
        );
        return rows[0];
    },


    // Assign a new captain to the team
    async updateCaptain(teamId, userId) {
        const { rows } = await pool.query(
            `UPDATE teams SET captain_id = $1 WHERE id = $2 RETURNING *;`,
            [userId, teamId]
        );
        return rows[0];
    }
};


module.exports = Team;