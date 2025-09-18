// alasdairwood04/intramural-sport-app/Intramural-Sport-App-e8c6434c08cc3d5e8f50235e1c5bb8b141dc46b4/client/src/api/leagueApi.js
import apiClient from './api';

export const getLeagueStandings = (seasonId, sportId) => {
  return apiClient.get(`/leagues/${seasonId}/${sportId}`);
};