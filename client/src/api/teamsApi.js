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

export const getTeamById = (teamId) => {
    return apiClient.get(`/teams/${teamId}`);
};


// captains and admins can use these endpoints
export const requestToJoin = (teamId) => {
  return apiClient.post(`/teams/${teamId}/requests`);
};

export const getJoinRequests = (teamId) => {
  return apiClient.get(`/teams/${teamId}/requests/view`);
};

export const approveJoinRequest = (teamId, requestId) => {
  return apiClient.post(`/teams/${teamId}/requests/${requestId}/approve`);
};

export const rejectJoinRequest = (teamId, requestId) => {
  return apiClient.post(`/teams/${teamId}/requests/${requestId}/reject`);
};