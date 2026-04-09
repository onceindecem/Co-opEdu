import api from '../axiosInstance';

export const applicationService = {

  getApplicationsByProject: (projectId: string) => 
    api.get(`/applications/project/${projectId}`),
  // 1. ดึงประวัติการสมัครของนักศึกษาที่ล็อกอินอยู่
  getMyApplications: async () => {
    return api.get(`/applications/my-applications`);
  },

  // 2. กดสมัครโปรเจกต์ใหม่
  createApplication: async (projID: string) => {
    return api.post(
      `/applications`,
      { projID: projID });
  },

  // 3. (แถมเผื่อไว้) ยกเลิกการสมัคร
  deleteApplication: async (appID: string) => {
    return api.delete(`/applications/${appID}`);
  },

  // อัปเดตสถานะการสมัคร (PENDING, APPROVED, DENIED)
  updateAppStat: async (appId: string, status: string) => {
    return await api.patch(`/applications/${appId}/status`, { status });
  },

  // อัปเดตสถานะการจ้างงาน (WAITING, HIRED, NOT_HIRED)
  updateHiredStat: async (appId: string, hiredStat: string) => {
    return await api.patch(`/applications/${appId}/hired-status`, { hiredStat });
  }
  
};