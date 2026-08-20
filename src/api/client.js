import axios from 'axios';

const client = axios.create({
  // Forzamos el subdominio con /api directamente
  baseURL: 'https://ottolab.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para enviar el token JWT automáticamente si existe
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;