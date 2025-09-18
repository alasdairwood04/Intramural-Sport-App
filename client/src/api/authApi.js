import apiClient from './api';

export const loginUser = (credentials) => {
    return apiClient.post('/auth/login', credentials);
};

export const registerUser = (userInfo) => {
    return apiClient.post('/auth/register', userInfo);
};

export const logoutUser = () => {
    return apiClient.post('/auth/logout');
};

export const checkAuthStatus = () => {
    return apiClient.get('/profile');
};