import api from '../axiosInstance';

export const reportService = {

  // ------------------------------------
  // ฝั่งนักศึกษา
  // ------------------------------------
  
  // ดึงประวัติ Report ของตัวเอง
  getMyReports: async () => {
    return await api.get('/reports');
  },

  // สร้าง Report ใหม่
  createReport: async (data: any) => {
    return await api.post('/reports', data);
  },

  // แก้ไข Report
  updateReport: async (id: string, data: any) => {
    return await api.patch(`/reports/${id}`, data);
  },

  // ลบ Report
  deleteReport: async (id: string) => {
    return await api.delete(`/reports/${id}`);
  },

  // ------------------------------------
  // ฝั่งอาจารย์ (Advisor)
  // ------------------------------------

  // 🌟 [เพิ่มใหม่] ดึง Report ทั้งหมดสำหรับหน้า Dashboard อาจารย์
  getAllReportsForAdvisor: async () => {
    return await api.get('/reports/advisor/all');
  }
  
};