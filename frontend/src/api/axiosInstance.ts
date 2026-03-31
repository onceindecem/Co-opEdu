import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL ของ NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // find token in localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      // if have token, attach it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized: Token is invalid or expired. Logging out user.');
      localStorage.removeItem('accessToken'); // delete token from localStorage
      // window.location.href = '/login'; // 💡 ถ้ามีหน้า Login แล้ว เปิดคอมเมนต์บรรทัดนี้ได้เลยครับ ให้มันเด้งไปหน้าล็อกอินอัตโนมัติ
    }
    console.error('API Error:', error.response?.data?.message || 'Server Error');
    return Promise.reject(error);
  }
);

export default api;