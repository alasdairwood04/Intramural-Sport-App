import apiClient from './api';

export const getAllSeasons = () => {
    return apiClient.get('/seasons');
};

export const getActiveSeasons = () => {
    return apiClient.get('/seasons/active');
};

export const getSeasonById = (seasonId) => {
    return apiClient.get(`/seasons/${seasonId}`);
};

export const createSeason = (seasonData) => {
    return apiClient.post('/seasons', seasonData);
};

export const updateSeason = (seasonId, seasonData) => {
    return apiClient.put(`/seasons/${seasonId}`, seasonData);
};

export const deleteSeason = (seasonId) => {
    return apiClient.delete(`/seasons/${seasonId}`);
};

// 
