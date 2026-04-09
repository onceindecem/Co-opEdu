import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_BACKEND_URL, 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 && 
      error.config.url !== '/users/profile' && 
      !error.config.url?.includes('/login') 
    ) {
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;