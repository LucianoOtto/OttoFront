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
    let token = localStorage.getItem('token');

    // Buscar en la clave correcta configurada en Zustand: "admin-auth"
    if (!token) {
      const adminAuth = localStorage.getItem('admin-auth');
      if (adminAuth) {
        try {
          const parsed = JSON.parse(adminAuth);
          token = parsed.state?.token;
        } catch (err) {
          console.error('Error al parsear admin-auth de Zustand:', err);
        }
      }
    }

    // Adjuntar token al header Authorization si existe
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default client;