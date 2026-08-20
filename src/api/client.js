import axios from 'axios';

const client = axios.create({
  // Asegurate de concatenar /api al final
  baseURL: 'https://ottolab.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;