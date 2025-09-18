import apiClient from './api';

export const getAllFixtures = () => {
    return apiClient.get('/fixtures');
};