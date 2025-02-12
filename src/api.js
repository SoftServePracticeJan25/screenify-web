import axios from 'axios';

// Создаём инстанс axios с базовыми настройками
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // add .env file with such line REACT_APP_API_URL=adressofapi
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auto addint token if we have such
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
