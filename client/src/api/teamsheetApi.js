import apiClient from './api';

export const getTeamsheet = (fixtureId, teamId) => {
    return apiClient.get(`/fixtures/${fixtureId}/teamsheet/${teamId}`);
};

// POST for creating
export const createTeamsheet = (fixtureId, teamsheetData) => {
    return apiClient.post(`/fixtures/${fixtureId}/teamsheet`, teamsheetData);
};

// PUT for updating
export const updateTeamsheet = (fixtureId, teamId, teamsheetData) => {
    return apiClient.put(`/fixtures/${fixtureId}/teamsheet/${teamId}`, teamsheetData);
};

export const getFixtureTeamsheets = (fixtureId) => {
    return apiClient.get(`/fixtures/${fixtureId}/teamsheets`);
};