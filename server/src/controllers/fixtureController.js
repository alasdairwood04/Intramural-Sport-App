const Fixture = require('../models/Fixture');

exports.createFixture = async (req, res, next) => {
    try {
        const newFixture = await Fixture.create(req.body);
        res.status(201).json({ success: true, data: newFixture });
    } catch (error) {
        next(error);
    }
};

exports.getAllFixtures = async (req, res, next) => {
    try {
        const fixtures = await Fixture.findAll();
        res.status(200).json({ success: true, data: fixtures });
    } catch (error) {
        next(error);
    }
};

exports.confirmFixture = async (req, res, next) => {
    try {
        const fixtureId = req.params.id;
        const confirmedFixture = await Fixture.confirmFixture(fixtureId);
        if (!confirmedFixture) {
            return res.status(404).json({ success: false, message: 'Fixture not found' });
        }
        res.status(200).json({ success: true, data: confirmedFixture });
    } catch (error) {
        next(error);
    }
};

exports.submitResult = async (req, res, next) => {
    try {
        const fixtureId = req.params.id;
        const updatedFixture = await Fixture.submitResult(fixtureId, req.body);
        if (!updatedFixture) {
            return res.status(404).json({ success: false, message: 'Fixture not found' });
        }
        res.status(200).json({ success: true, data: updatedFixture });
    } catch (error) {
        next(error);
    }
};