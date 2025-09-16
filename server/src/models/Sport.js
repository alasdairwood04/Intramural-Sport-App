const pool = require('../config/database');

const Sport = {
    // Get all sports
    async getAllSports() {
        const { rows } = await pool.query("SELECT * FROM sports ORDER BY name");
        return rows;
    },

    // Get a sport by ID
    async findById(id) {
        const { rows } = await pool.query("SELECT * FROM sports WHERE id = $1", [id]);
        return rows[0];
    },

    // Create a new sport
    async create(sportData) {
        const { name, description, max_team_size, min_team_size } = sportData;
        const { rows } = await pool.query(
            `INSERT INTO sports (name, description, max_team_size, min_team_size)
             VALUES ($1, $2, $3, $4) RETURNING *;`,
            [name, description, max_team_size, min_team_size]
        );
        return rows[0];
    },

    // update and delete methods can be added as needed
    async update(sportId, updateData) {
        const allowedFields = ['name', 'description', 'max_team_size', 'min_team_size', 'is_active'];

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
        // If no valid fields to update, return the existing sport
        if (fields.length === 0) {
        return await this.findById(sportId);
        }
        
        values.push(sportId); // For the WHERE clause
        const query = `UPDATE sports SET ${fields.join(', ')} WHERE id = $${index} RETURNING *;`;
        const { rows } = await pool.query(query, values);
        return rows[0];
      
},

    async delete(id) {
        const { rows } = await pool.query("DELETE FROM sports WHERE id = $1 RETURNING *;", [id]);
        return rows[0];
    }
};

module.exports = Sport;