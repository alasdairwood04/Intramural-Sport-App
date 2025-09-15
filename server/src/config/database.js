const pg = require('pg');
require('dotenv').config();

// Initialize dotenv

const { Pool } = pg;

// Use export default for ES Modules
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'Robertw00d04£',
    database: process.env.DB_NAME || 'intramural_sports_dev',
    port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(-1);
});

module.exports = pool;
