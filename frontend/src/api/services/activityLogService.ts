import api from '../axiosInstance'; // ปรับ path ให้ตรงกับ Axios ของคุณ

export const activityLogService = {
  getAll: () => api.get('/activity-logs'),
};