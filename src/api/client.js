import axios from 'axios';

const client = axios.create({
  baseURL: 'https://ottolab.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  // 1. Intentar obtener token directo
  let token = localStorage.getItem('token');

  // 2. Si no existe, intentar leerlo desde la persistencia de Zustand
  if (!token) {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token || parsed.state?.user?.token;
      } catch (e) {
        console.error("Error al parsear auth-storage", e);
      }
    }
  }

  // 3. Si hay token, adjuntarlo en el header Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;