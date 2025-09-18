import apiClient from "./api";

export const getAllSports = () => {
    return apiClient.get("/sports");
};