import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL ของ NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

// ดักจับ Error เผื่อ Server พัง
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || 'Server Error');
    return Promise.reject(error);
  }
);

export default api;