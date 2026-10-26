//src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8087/medicare', 
});

api.interceptors.request.use(
  (config) => {
const sessionData = localStorage.getItem('user');
    if (sessionData) {
      const parsedUser = JSON.parse(sessionData);
      if (parsedUser.token) {
        config.headers['Authorization'] = `Bearer ${parsedUser.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;