import apiClient from './api';

export const getActiveSeasons = () => {
    return apiClient.get('/seasons/active');
};