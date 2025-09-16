const Season = require('../models/Season');

// Get all seasons
exports.getAllSeasons = async (req, res, next) => {
    try {
        const rows = await Season.getAllSeasons();
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        next(error);
    }
};

// Get season by Id
exports.getSeasonById = async (req, res, next) => {
    try {
        const seasonId = req.params.seasonId;
        const season = await Season.findById(seasonId);
        if (!season) {
            return res.status(404).json({ success: false, message: 'Season not found' });
        }
        res.status(200).json({ success: true, data: season });
    } catch (error) {
        next(error);
    }
};

// find active seasons
exports.findActiveSeasons = async (req, res, next) => {
    try {
        const activeSeasons = await Season.findActive();
        res.status(200).json({ success: true, data: activeSeasons });
    } catch (error) {
        next(error);
    }
};

// create a new season (admin only)
exports.createSeason = async (req, res, next) => {
    try {
        const seasonData = req.body;
        const newSeason = await Season.create(seasonData);
        res.status(201).json({ success: true, data: newSeason });
    } catch (error) {
        next(error);
    }
};

// update a season (admin only)
exports.updateSeason = async (req, res, next) => {
    try {
        const seasonId = req.params.seasonId; // Get seasonId from route parameters
        const seasonData = req.body;
        const updatedSeason = await Season.update(seasonId, seasonData);
        if (!updatedSeason) {
            return res.status(404).json({ success: false, message: 'Season not found' });
        }
        res.status(200).json({ success: true, data: updatedSeason });
    } catch (error) {
        next(error);
    }
};

// delete a season (admin only)
exports.deleteSeason = async (req, res, next) => {
    try {
        const seasonId = req.params.seasonId;
        const deletedSeason = await Season.delete(seasonId);
        if (!deletedSeason) {
            return res.status(404).json({ success: false, message: 'Season not found' });
        }
        res.status(200).json({ success: true, data: deletedSeason });
    } catch (error) {
        next(error);
    }
};

