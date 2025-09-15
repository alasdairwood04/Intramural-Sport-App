exports.up = (client) => {
    return client.query(`
        CREATE TABLE IF NOT EXISTS teams (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
        season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
        captain_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        description TEXT,
        logo_url TEXT,
        points INT DEFAULT 0,
        matches_played INT DEFAULT 0,
        wins INT DEFAULT 0,
        losses INT DEFAULT 0,
        draws INT DEFAULT 0,
        goals_for INT DEFAULT 0,
        goals_against INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (name, sport_id, season_id)

    );

    CREATE INDEX IF NOT EXISTS idx_teams_sport_season ON teams(sport_id, season_id);
    CREATE INDEX IF NOT EXISTS idx_teams_captain ON teams(captain_id);
    CREATE INDEX IF NOT EXISTS idx_teams_active ON teams(is_active);
`);
}

exports.down = (client) => {
    return client.query(`
        DROP TABLE IF EXISTS teams;
    `);
}