const Sport = require('../models/Sport');

// Get all sports
exports.getAllSports = async (req, res, next) => {
    try {
        const sports = await Sport.getAllSports();
        res.status(200).json({ success: true, data: sports });
    } catch (error) {
        next(error);
    }
};

// Get sport by Id
exports.getSportById = async (req, res, next) => {
    try {
        const sportId = req.params.sportId;
        const sport = await Sport.findById(sportId);
        if (!sport) {
            return res.status(404).json({ success: false, message: 'Sport not found' });
        }
        res.status(200).json({ success: true, data: sport });
    } catch (error) {
        next(error);
    }
};


// create a new sport (admin only)
exports.createSport = async (req, res, next) => {
    try {
        const sportData = req.body;
        const newSport = await Sport.create(sportData);
        res.status(201).json({ success: true, data: newSport });
    } catch (error) {
        next(error);
    }
};

// update a sport (admin only)
exports.updateSport = async (req, res, next) => {
    try {
        const sportId = req.params.sportId; // Get sportId from route parameters
        const updateData = req.body; // Get update data from request body
        const updatedSport = await Sport.update(sportId, updateData);
        if (!updatedSport) {
            return res.status(404).json({ success: false, message: 'Sport not found' });
        }
        res.status(200).json({ success: true, data: updatedSport });
    } catch (error) {
        next(error);
    }
};


// delete a sport (admin only)
exports.deleteSport = async (req, res, next) => {
    try {
        const sportId = req.params.sportId;
        const deletedSport = await Sport.delete(sportId);
        if (!deletedSport) {
            return res.status(404).json({ success: false, message: 'Sport not found' });
        }
        res.status(200).json({ success: true, data: deletedSport });
    } catch (error) {
        next(error);
    }
};
