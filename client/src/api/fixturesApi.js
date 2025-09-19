import apiClient from './api';

export const getAllFixtures = () => {
    return apiClient.get('/fixtures');
};

export const createFixture = (fixtureData) => {
    return apiClient.post('/fixtures', fixtureData);
};

export const getPotentialOpponents = (teamId) => {
    return apiClient.get(`/fixtures/${teamId}/potential-opponents`);
};

export const getFixturesByTeam = (teamId) => {
    return apiClient.get(`/fixtures/team/${teamId}`);
};

// Get teams for a specific fixture
export const getTeamsForFixture = (fixtureId) => {
    return apiClient.get(`/fixtures/${fixtureId}/teams`);
};