const { runMigrations } = require('./src/utils/migrate');

// This function will be executed when the script is run
async function migrate() {
  try {
    console.log('Starting migration process...');
    await runMigrations();
    console.log('Migration process finished successfully.');
    // Exit the process with a success code
    process.exit(0);
  } catch (error) {
    console.error('Failed to run migrations:', error);
    // Exit the process with a failure code
    process.exit(1);
  }
}

// Call the function
migrate();