import apiClient from "./api";

export const getAllSports = () => {
    return apiClient.get("/sports");
};

export const createSport = (sportData) => {
    return apiClient.post("/sports", sportData);
};

export const updateSport = (id, sportData) => {
    return apiClient.put(`/sports/${id}`, sportData);
};

export const deleteSport = (id) => {
    return apiClient.delete(`/sports/${id}`);
};