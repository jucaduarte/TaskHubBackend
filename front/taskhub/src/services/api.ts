import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// Validação da variável de ambiente
const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
    throw new Error('VITE_API_URL não está definida no arquivo .env');
}

// Instância do axios
const api = axios.create({
    baseURL,
});

// Interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;