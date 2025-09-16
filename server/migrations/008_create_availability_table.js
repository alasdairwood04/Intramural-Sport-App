exports.up = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS availability (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            fixture_id UUID NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
            is_available BOOLEAN NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (user_id, fixture_id)
        );

        CREATE INDEX IF NOT EXISTS idx_availability_user_fixture ON availability(user_id, fixture_id);
    `);
};

exports.down = async (client) => {
    await client.query(`
        DROP TABLE IF EXISTS availability;
    `);
};