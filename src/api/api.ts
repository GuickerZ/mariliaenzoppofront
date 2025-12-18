import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

if (!baseURL) {
    console.error('❌ ERRO: VITE_API_URL não está configurada! As requisições à API não funcionarão.');
    console.error('📝 Configure a variável de ambiente VITE_API_URL no painel da Vercel ou no arquivo .env');
}

const api = axios.create({
    baseURL: baseURL || 'http://localhost:3333',
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Provide user id header if available so backend can compute hasLiked/hasDisliked
        const userId = localStorage.getItem('userId');
        if (userId && !config.headers['idUsuario']) {
            config.headers['idUsuario'] = userId;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);

        if (error.response?.status === 401) {
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;