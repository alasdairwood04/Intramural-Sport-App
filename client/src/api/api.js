import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api', // Proxy to backend server
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClient;