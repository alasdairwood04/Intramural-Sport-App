import apiClient from './api';

export const getUserTeams = () => {
    return apiClient.get('/teams/user/me');
};

export const getAllTeams = () => {
    return apiClient.get('/teams');
};

export const createTeam = (teamData) => {
    return apiClient.post('/teams', teamData);
};

