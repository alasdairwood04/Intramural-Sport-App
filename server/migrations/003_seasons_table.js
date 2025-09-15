exports.up = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS seasons (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(100) UNIQUE NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT seasons_date_check CHECK (start_date < end_date)
    );

    CREATE INDEX IF NOT EXISTS idx_seasons_active ON seasons(is_active);
    CREATE INDEX IF NOT EXISTS idx_seasons_dates ON seasons(start_date, end_date);

`);
        
}

exports.down = async (client) => {
    await client.query(`
        DROP TABLE IF EXISTS seasons;
    `);
}