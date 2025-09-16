const pool = require('../config/database');
const { findById } = require('./User');

const Season = {
    // Get all seasons
    async getAllSeasons() {
        const { rows } = await pool.query("SELECT * FROM seasons ORDER BY name");
        return rows;
    },

    async findById(id) {
        const { rows } = await pool.query("SELECT * FROM seasons WHERE id = $1", [id]);
        return rows[0];
    },

    // find active
    async findActive() {
        const { rows } = await pool.query("SELECT * FROM seasons WHERE is_active = true ORDER BY name");
        return rows;
    },

    // Create a new season
    async create(seasonData) {
        const { name, start_date, end_date } = seasonData;
        const { rows } = await pool.query(
            `INSERT INTO seasons (name, start_date, end_date)
             VALUES ($1, $2, $3) RETURNING *;`,
            [name, start_date, end_date]
        );
        return rows[0];
    },

    // update and delete methods can be added as needed
    async update(seasonId, updateData) {
        const allowedFields = ['name', 'start_date', 'end_date', 'is_active'];
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
        if (fields.length === 0) {
            throw new Error("No valid fields to update");
        }
        const query = `UPDATE seasons SET ${fields.join(", ")} WHERE id = $${index} RETURNING *;`;
        const { rows } = await pool.query(query, [...values, seasonId]);
        return rows[0];
    },

    async delete(seasonId) {
        const { rowCount } = await pool.query("DELETE FROM seasons WHERE id = $1", [seasonId]);
        return rowCount > 0;
    }
};

module.exports = Season;