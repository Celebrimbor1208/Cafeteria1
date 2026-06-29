import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // CORREGIDO: Usar backticks (``) no comillas simples ('')
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Interceptor: Token adjuntado.");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;






