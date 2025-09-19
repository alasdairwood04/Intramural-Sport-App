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

exports.getFixturesByTeam = async (req, res, next) => {
    try {
        const teamId = req.params.teamId;
        const fixtures = await Fixture.findByTeamId(teamId);
        res.status(200).json({ success: true, data: fixtures });
    } catch (error) {
        next(error);
    }
};

exports.getPotentialOpponents = async (req, res, next) => {
    try {
        const teamId = req.params.teamId;
        const opponents = await Fixture.findPotentialOpponents(teamId);
        res.status(200).json({ success: true, data: opponents });
    } catch (error) {
        next(error);
    }
}

exports.getTeamsByFixture = async (req, res, next) => {
    try {
        const fixtureId = req.params.fixtureId;
        const teams = await Fixture.findTeamsByFixture(fixtureId);
        res.status(200).json({ success: true, data: teams });
    } catch (error) {
        next(error);
    }
};