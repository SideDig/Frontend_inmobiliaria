import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.8.43:5000/routes',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
