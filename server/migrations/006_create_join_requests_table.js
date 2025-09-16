// server/migrations/006_create_join_requests_table.js

exports.up = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS join_requests (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
            message TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            -- A user can only request to join a specific team once
            UNIQUE (team_id, user_id)
        );

        CREATE INDEX IF NOT EXISTS idx_join_requests_team_id ON join_requests(team_id);
        CREATE INDEX IF NOT EXISTS idx_join_requests_user_id ON join_requests(user_id);
    `);
};

exports.down = async (client) => {
    await client.query(`
        DROP TABLE IF EXISTS join_requests;
    `);
};