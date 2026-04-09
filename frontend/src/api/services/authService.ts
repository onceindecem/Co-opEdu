import api from '../axiosInstance';
// import 'dotenv/config'

export const authService = {
  registerHR: (data: any) => api.post('/auth/register-hr', data),

  registerUser: (data: any) => api.post('/auth/register', data),

  login: (credentials: any) => api.post('/auth/login', credentials),

  loginWithGoogle: () => {
    const url = process.env.BACKEND_URL;
    window.location.href = `${url}/auth/google`;
  },

  getProfile: () => api.get('/users/profile'),
  
  logout: () => api.post('/auth/logout')
};