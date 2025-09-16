const pool = require('../config/database');

const League = {
    async getStandings(seasonId, sportId) {
        const { rows } = await pool.query(
            `SELECT
                t.id,
                t.name,
                COUNT(f.id) AS matches_played,
                SUM(CASE WHEN f.home_team_id = t.id AND f.home_team_score > f.away_team_score THEN 1 ELSE 0 END) +
                SUM(CASE WHEN f.away_team_id = t.id AND f.away_team_score > f.home_team_score THEN 1 ELSE 0 END) AS wins,
                SUM(CASE WHEN f.home_team_id = t.id AND f.home_team_score < f.away_team_score THEN 1 ELSE 0 END) +
                SUM(CASE WHEN f.away_team_id = t.id AND f.away_team_score < f.home_team_score THEN 1 ELSE 0 END) AS losses,
                SUM(CASE WHEN f.home_team_score = f.away_team_score THEN 1 ELSE 0 END) AS draws,
                SUM(CASE WHEN f.home_team_id = t.id THEN f.home_team_score ELSE f.away_team_score END) AS goals_for,
                SUM(CASE WHEN f.home_team_id = t.id THEN f.away_team_score ELSE f.home_team_score END) AS goals_against
            FROM teams t
            LEFT JOIN fixtures f ON (t.id = f.home_team_id OR t.id = f.away_team_id) AND f.status = 'completed'
            WHERE t.season_id = $1 AND t.sport_id = $2
            GROUP BY t.id
            ORDER BY wins DESC, (SUM(CASE WHEN f.home_team_id = t.id THEN f.home_team_score ELSE f.away_team_score END) - SUM(CASE WHEN f.home_team_id = t.id THEN f.away_team_score ELSE f.home_team_score END)) DESC;`,
            [seasonId, sportId]
        );
        return rows;
    },

    async getTeamStats(teamId) {
        // This can be expanded with more detailed stats
        const { rows } = await this.getStandings(null, null); // Simplified for now
        return rows.find(team => team.id === teamId);
    },

    async getPlayerStats(playerId) {
        // This will require more complex logic based on your match events implementation
        // For now, we'll return a placeholder
        return { message: 'Player stats not yet implemented' };
    }
};

module.exports = League;