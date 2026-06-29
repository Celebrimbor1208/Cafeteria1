import axios from 'axios';

const api = axios.create({
  // Esta es la URL de tu backend que Render te proporcionó
  baseURL: 'https://cafeteria1-20vd.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;