import api from '../axiosInstance';
// import 'dotenv/config'

const baseURL = "http://localhost:3000";

export const authService = {
  registerHR: (data: any) => api.post('/auth/register-hr', data),

  registerUser: (data: any) => api.post('/auth/register', data),

  login: (credentials: any) => api.post('/auth/login', credentials),

  loginWithGoogle: () => {
    const url = baseURL;
    window.location.href = `${url}/auth/google`;
  },

  getProfile: () => api.get('/users/profile'),
  
  logout: () => api.post('/auth/logout')
};