exports.up = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS fixtures (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
            sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
            home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
            away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
            fixture_date TIMESTAMP WITH TIME ZONE,
            status VARCHAR(50) NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'confirmed', 'completed')),
            home_team_score INT,
            away_team_score INT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT different_teams CHECK (home_team_id <> away_team_id)
        );

        CREATE INDEX IF NOT EXISTS idx_fixtures_season_sport ON fixtures(season_id, sport_id);
        CREATE INDEX IF NOT EXISTS idx_fixtures_teams ON fixtures(home_team_id, away_team_id);
    `);
};

exports.down = async (client) => {
    await client.query(`
        DROP TABLE IF EXISTS fixtures;
    `);
};