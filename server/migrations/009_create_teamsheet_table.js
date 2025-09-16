exports.up = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS teamsheets (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            fixture_id UUID NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
            team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
            player_ids UUID[] NOT NULL, -- Array of user IDs
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (fixture_id, team_id)
        );

        CREATE INDEX IF NOT EXISTS idx_teamsheets_fixture_team ON teamsheets(fixture_id, team_id);
    `);
};

exports.down = async (client) => {
    await client.query(`
        DROP TABLE IF EXISTS teamsheets;
    `);
};