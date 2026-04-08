import api from '../axiosInstance';

// ⚠️ อย่าลืมเปลี่ยน Port ให้ตรงกับ Backend ของคุณนะครับ (ปกติ NestJS รันที่ 3000)

// สร้างฟังก์ชันช่วยดึง Token จาก LocalStorage เพื่อความสะดวก
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // ⚠️ เช็กชื่อ Key ที่คุณใช้เก็บ Token ตอน Login ด้วยนะครับ
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const applicationService = {

  getApplicationsByProject: (projectId: string) => 
    api.get(`/applications/project/${projectId}`),
  // 1. ดึงประวัติการสมัครของนักศึกษาที่ล็อกอินอยู่
  getMyApplications: async () => {
    return api.get(`/applications/my-applications`, {
      headers: getAuthHeaders(),
    });
  },

  // 2. กดสมัครโปรเจกต์ใหม่
  createApplication: async (projID: string) => {
    return api.post(
      `/applications`,
      { projID: projID }, // ส่งไปแค่ projID เพราะ Backend เราดึง userID จาก Token แล้ว
      { headers: getAuthHeaders() }
    );
  },

  // 3. (แถมเผื่อไว้) ยกเลิกการสมัคร
  deleteApplication: async (appID: string) => {
    return api.delete(`/applications/${appID}`, {
      headers: getAuthHeaders(),
    });
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