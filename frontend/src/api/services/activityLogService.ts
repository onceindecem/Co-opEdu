import api from '../axiosInstance';

export const activityLogService = {
  getAll: () => api.get('/activity-logs'),
};