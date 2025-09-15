exports.up = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS team_members (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            role VARCHAR(50) NOT NULL,
            joined_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (team_id, user_id)
        );

        CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
        CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
    `);
}

exports.down = async (client) => {
    await client.query(`
        DROP TABLE IF EXISTS team_members;
    `);
}