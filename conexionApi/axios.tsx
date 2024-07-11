import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-inmobiliaria-5uss.onrender.com/routes',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
