import api from '../axiosInstance';

const baseURL = api.defaults.baseURL;

export const authService = {
  registerHR: (data: any) => api.post('/auth/register-hr', data),

  registerUser: (data: any) => api.post('/auth/register', data),

  login: (credentials: any) => api.post('/auth/login', credentials),

  loginWithGoogle: () => {
    const url = baseURL;
    window.location.href = `${url}/auth/google`;
  },

  getProfile: () => api.get('/users/profile'),

  setToken: (token: string) => localStorage.setItem('accessToken', token),
  
  logout: () => localStorage.removeItem('accessToken'),
};