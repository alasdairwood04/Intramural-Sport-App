exports.up = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS teamsheets (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            fixture_id UUID NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
            team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (fixture_id, team_id)
        );

        CREATE TABLE IF NOT EXISTS teamsheet_players (
            teamsheet_id UUID NOT NULL REFERENCES teamsheets(id) ON DELETE CASCADE,
            player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            position VARCHAR(50),
            is_starter BOOLEAN DEFAULT true,
            PRIMARY KEY (teamsheet_id, player_id)
        );

        CREATE INDEX IF NOT EXISTS idx_teamsheets_fixture_team ON teamsheets(fixture_id, team_id);
        CREATE INDEX IF NOT EXISTS idx_teamsheet_players_teamsheet ON teamsheet_players(teamsheet_id);
    `);
};

exports.down = async (client) => {
    await client.query(`
        DROP TABLE IF EXISTS teamsheet_players;
        DROP TABLE IF EXISTS teamsheets;
    `);
};