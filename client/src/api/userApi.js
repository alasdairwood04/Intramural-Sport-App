import apiClient from './api';

// get current user
export const getCurrentUser = () => {
    return apiClient.get('/users/me');
};

// update current user profile
export const updateProfile = (profileData) => {
    return apiClient.put('/users/me', profileData);
};

// change current user password
export const changePassword = (passwordData) => {
    return apiClient.put('/users/me/password', passwordData);
};