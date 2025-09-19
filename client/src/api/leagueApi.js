import apiClient from './api';

export const getLeagueStandings = (seasonId, sportId) => {
  return apiClient.get(`/leagues/${seasonId}/${sportId}`);
};