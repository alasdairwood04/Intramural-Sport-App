import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api', // Proxy to backend server
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Include cookies for cross-origin requests
});

export default apiClient;