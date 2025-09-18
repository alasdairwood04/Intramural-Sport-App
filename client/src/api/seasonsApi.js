import apiClient from './api';

export const getActiveSeasons = () => {
    return apiClient.get('/seasons/active');
};

export const getSeasonById = (seasonId) => {
    return apiClient.get(`/seasons/${seasonId}`);
};