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
};

module.exports = User;