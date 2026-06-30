import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cafeteria1-20vd.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

function tokenExpirado(token: string): boolean {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const payload = JSON.parse(jsonPayload);
        const ahora = Math.floor(Date.now() / 1000);
        return payload.exp < ahora;
    } catch {
        return true;
    }
}

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            if (tokenExpirado(token)) {
                console.warn("Token expirado o inválido, limpiando sesión.");
                localStorage.clear();
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;