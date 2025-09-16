const Availability = require('../models/Availability');

// Mark availability for a user for a specific fixture
exports.markAvailability = async (req, res, next) => {
    try {
        const { fixture_id, is_available } = req.body;
        const user_id = req.user.id;
        const newAvailability = await Availability.mark({ user_id, fixture_id, is_available });
        res.status(201).json({ success: true, data: newAvailability });
    } catch (error) {
        next(error);
    }
};

// Get availability for a specific fixture
exports.getTeamAvailability = async (req, res, next) => {
    try {
        const fixtureId = req.params.id;
        const availability = await Availability.getForFixture(fixtureId);
        res.status(200).json({ success: true, data: availability });
    } catch (error) {
        next(error);
    }
};

// Update availability by its ID
exports.updateAvailability = async (req, res, next) => {
    try {
        const availabilityId = req.params.id;
        const { is_available } = req.body;
        const updatedAvailability = await Availability.update(availabilityId, is_available);
        if (!updatedAvailability) {
            return res.status(404).json({ success: false, message: 'Availability record not found' });
        }
        res.status(200).json({ success: true, data: updatedAvailability });
    } catch (error) {
        next(error);
    }
};