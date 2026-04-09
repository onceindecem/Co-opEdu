import api from '../axiosInstance';

export const reportService = {

  // for student
  
  getMyReports: async () => {
    return await api.get('/reports');
  },

  createReport: async (data: any) => {
    return await api.post('/reports', data);
  },

  updateReport: async (id: string, data: any) => {
    return await api.patch(`/reports/${id}`, data);
  },

  deleteReport: async (id: string) => {
    return await api.delete(`/reports/${id}`);
  },

  // for advisor
  getAllReportsForAdvisor: async () => {
    return await api.get('/reports/advisor/all');
  }
  
};