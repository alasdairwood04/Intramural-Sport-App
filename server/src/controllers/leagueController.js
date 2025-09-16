const League = require('../models/League');

exports.getLeagueStandings = async (req, res, next) => {
    try {
        const { seasonId, sportId } = req.params;
        const standings = await League.getStandings(seasonId, sportId);
        res.status(200).json({ success: true, data: standings });
    } catch (error) {
        next(error);
    }
};

exports.getTeamStats = async (req, res, next) => {
    try {
        const { id } = req.params;
        const stats = await League.getTeamStats(id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

exports.getPlayerStats = async (req, res, next) => {
    try {
        const { id } = req.params;
        const stats = await League.getPlayerStats(id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};