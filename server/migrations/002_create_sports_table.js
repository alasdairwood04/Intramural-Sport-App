exports.up = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS sports (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            max_team_size INT NOT NULL,
            min_team_size INT NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_sports_name ON sports(name);
        CREATE INDEX IF NOT EXISTS idx_sports_active ON sports(is_active);
    `);
}

exports.down = async (client) => {
    await client.query(`
        DROP TABLE IF EXISTS sports;
    `);
}