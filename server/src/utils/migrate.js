const fs = require('fs'); // File system module to read migration files
const path = require('path');
const pool = require('../config/database');

const MIGRATIONS_DIR = path.join(__dirname, '../../migrations');

async function createMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      ran_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function runMigrations() {
  const client = await pool.connect();

  try {
    await createMigrationsTable(client);

    const appliedMigrationsResult = await client.query('SELECT name FROM migrations ORDER BY name;');
    const appliedMigrations = new Set(appliedMigrationsResult.rows.map(row => row.name));

    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.js'))
      .sort();

    console.log('Running database migrations...');
    
    for (const file of migrationFiles) {
      if (!appliedMigrations.has(file)) {
        const migration = require(path.join(MIGRATIONS_DIR, file));
        
        await client.query('BEGIN;');
        console.log(`Applying migration: ${file}`);
        await migration.up(client);
        await client.query('INSERT INTO migrations(name) VALUES($1);', [file]);
        await client.query('COMMIT;');
        console.log(`Migration ${file} applied successfully.`);
      }
    }

    console.log('All pending migrations completed!');
  } catch (error) {
    console.error('Migration error:', error);
    await client.query('ROLLBACK;'); // Rollback in case of a failure
    throw error;
  } finally {
    client.release();
  }
}

async function rollbackLastMigration() {
  const client = await pool.connect();

  try {
    await createMigrationsTable(client);
    
    const lastMigrationResult = await client.query('SELECT name FROM migrations ORDER BY name DESC LIMIT 1;');
    if (lastMigrationResult.rows.length === 0) {
      console.log('No migrations to rollback.');
      return;
    }

    const lastMigrationName = lastMigrationResult.rows[0].name;
    const migration = require(path.join(MIGRATIONS_DIR, lastMigrationName));

    await client.query('BEGIN;');
    console.log(`Rolling back migration: ${lastMigrationName}`);
    await migration.down(client);
    await client.query('DELETE FROM migrations WHERE name = $1;', [lastMigrationName]);
    await client.query('COMMIT;');
    console.log(`Migration ${lastMigrationName} rolled back successfully.`);
  } catch (error) {
    console.error('Rollback error:', error);
    await client.query('ROLLBACK;');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  runMigrations,
  rollbackLastMigration
};