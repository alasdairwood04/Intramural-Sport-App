const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
    // Find a user by their email
    async findByEmail(email) {
        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return rows[0];
    },

    // Find a user by their ID (used by Passport.js deserializeUser)
    async findById(id) {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        return rows[0];
    },

    // Create a new user
    async create(userData) {  // Fixed parameter destructuring
        const { email, password, firstName, lastName, studentId } = userData;

        // hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const { rows } = await pool.query(`
            INSERT INTO users (email, password_hash, first_name, last_name, student_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, role;`,
            [email, hashedPassword, firstName, lastName, studentId]  // Added the missing parameters
        );
        return rows[0];
    },

    // Create a new user as admin
    async createUserByAdmin(userData) {
        const { email, password, firstName, lastName, studentId, role } = userData;

        // hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const { rows } = await pool.query(`
            INSERT INTO users (email, password_hash, first_name, last_name, student_id, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email, role;`,
            [email, hashedPassword, firstName, lastName, studentId, role]
        );
        return rows[0];
    },

    // Get all users
    async getAllUsers() {
        const { rows } = await pool.query("SELECT id, email, first_name, last_name, student_id, role FROM users ORDER BY last_name, first_name");
        return rows;
    },

    // Update user details
    async update(userId, updateData) {
        const allowedFields = ['first_name', 'last_name', 'student_id', 'role'];
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
        const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${index} RETURNING id, email, first_name, last_name, student_id, role;`;
        const { rows } = await pool.query(query, [...values, userId]);
        return rows[0];
    },

    // Update user role
    async updateRole(userId, newRole) {
        const { rows } = await pool.query(`
            UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, first_name, last_name, student_id, role;`,
            [newRole, userId]
        );
        return rows[0];
    },

    // Delete a user by their ID
    async delete(userId) {
        const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [userId]);
        return rowCount > 0;
    },

    // Verify user's password
    async verifyPassword(userId, password) {
        const user = await this.findById(userId);
        if (!user) return false;
        return bcrypt.compare(password, user.password_hash);
    },

    // Update user's password
    async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const { rowCount } = await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hashedPassword, userId]);
        return rowCount > 0;
    }
};


module.exports = User;