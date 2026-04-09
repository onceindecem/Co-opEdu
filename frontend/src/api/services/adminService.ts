import api from '../axiosInstance'; 

export const adminService = {
  getAllUsers: async () => {
    return await api.get('/users'); 
  },

 createUser: async (userData: any) => {
    return api.post('/users/admin', userData);
  },

 updateUserRole: async (userId: string, newRole: string) => {
    return api.patch(`/users/${userId}`, 
      { role: newRole });
  },

  resetPassword: async (userId: number | string, newPassword: string) => {
    return await api.patch(`/users/${userId}`, { password: newPassword });
  },

  deleteUser: async (userId: number | string) => {
    return await api.delete(`/users/${userId}`);
  }
};