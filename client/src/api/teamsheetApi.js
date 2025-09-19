import apiClient from "./api";

export const getTeamsheet = (fixtureId, teamId) => {
    return apiClient.get(`/fixtures/${fixtureId}/teamsheet/${teamId}`);
};

export const submitTeamsheet = (fixtureId, teamsheetData) => {
    return apiClient.post(`/fixtures/${fixtureId}/teamsheet`, teamsheetData);
};

// get both team names by fixture ids
export const getTeamsForMultipleFixtures = (fixtureId) => {
    return apiClient.get(`/fixtures/:${fixtureId}/teamsheets`);
};