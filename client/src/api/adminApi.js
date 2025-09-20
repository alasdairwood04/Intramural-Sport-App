import apiClient from "./api";

// Sports Management
export const getAllSports = () => {
    return apiClient.get("/admin/sports");
};

export const createSport = (sportData) => {
    return apiClient.post("/admin/sports", sportData);
};

export const updateSport = (id, sportData) => {
    return apiClient.put(`/admin/sports/${id}`, sportData);
};

export const deleteSport = (id) => {
    return apiClient.delete(`/admin/sports/${id}`);
};

// Team Management
export const getAllTeams = () => {
    return apiClient.get("/admin/teams");
};

export const createTeam = (teamData) => {
    return apiClient.post("/admin/teams", teamData);
};

export const updateTeam = (id, teamData) => {
    return apiClient.put(`/admin/teams/${id}`, teamData);
};

export const deleteTeam = (id) => {
    return apiClient.delete(`/admin/teams/${id}`);
};

export const assignTeamCaptain = (teamId, captainData) => {
    return apiClient.put(`/admin/teams/${teamId}/captain`, captainData);
};

export const changeTeamCaptain = (teamId, captainData) => {
    return apiClient.put(`/admin/teams/${teamId}/change-captain`, captainData);
};

// User Management
export const getAllUsers = () => {
    return apiClient.get("/admin/users");
};

export const updateUserRole = (userId, roleData) => {
    return apiClient.put(`/admin/users/${userId}/role`, roleData);
};

export const deleteUser = (userId) => {
    return apiClient.delete(`/admin/users/${userId}`);
};

export const createUser = (userData) => {
    return apiClient.post("/admin/users", userData);
};

// Season Management
export const getAllSeasons = () => {
    return apiClient.get("/admin/seasons");
};

export const createSeason = (seasonData) => {
    return apiClient.post("/admin/seasons", seasonData);
};

export const updateSeason = (id, seasonData) => {
    return apiClient.put(`/admin/seasons/${id}`, seasonData);
};

export const deleteSeason = (id) => {
    return apiClient.delete(`/admin/seasons/${id}`);
};

// get dashboard stats
export const getDashboardStats = () => {
    return apiClient.get("/admin/dashboard-stats");
};