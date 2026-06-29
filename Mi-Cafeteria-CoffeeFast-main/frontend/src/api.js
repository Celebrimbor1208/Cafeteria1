import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://cafeteria1-20vd.onrender.com', // La URL de tu backend en Render
  headers: { 'Content-Type': 'application/json' }
});

export default apiClient;