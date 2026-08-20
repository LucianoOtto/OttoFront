import axios from 'axios';

const client = axios.create({
  baseURL: 'https://ottolab.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar automáticamente el Bearer Token en cada Request
client.interceptors.request.use(
  (config) => {
    let token = null;

    // 1. Intentar leer token directo
    token = localStorage.getItem('token');

    // 2. Si no existe, buscarlo dentro de la persistencia de Zustand (auth-storage)
    if (!token) {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          // Extrae el token según la estructura de Zustand
          token = parsed.state?.token || parsed.state?.user?.token;
        } catch (err) {
          console.error('Error al parsear auth-storage de Zustand:', err);
        }
      }
    }

    // 3. Adjuntar token al header Authorization si existe
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default client;