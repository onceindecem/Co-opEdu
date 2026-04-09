import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL ของ NestJS
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
      error.config.url !== '/users/profile' && // หยุดลูป checkAuth
      !error.config.url?.includes('/login')    // 🌟 เพิ่มบรรทัดนี้! เพื่อหยุดการรีเฟรชตอนรหัสผิด
    ) {
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;