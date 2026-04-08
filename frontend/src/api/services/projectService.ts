import api from '../axiosInstance';

export const projectService = {
  // ดึงข้อมูลทั้งหมด (สำหรับ Student / Admin)
  getAll: () => api.get('/projects'),

  getByCompanyId: (coId: string) => api.get(`/projects/company/${coId}`),
  

  // ดึงข้อมูลโปรเจกต์เดียว (ใช้ร่วมกันทั้ง getOne และ getById)
  getOne: (id: string) => api.get(`/projects/${id}`),
  getById: (id: string) => api.get(`/projects/${id}`),

  // 🌟 สำหรับหน้า CreateProject (รับ FormData เพื่อรองรับไฟล์ PDF)
  create: (formData: FormData) => {
    return api.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getHRProjects: () => api.get('/projects/hr-projects'), // สำหรับ HR ดึงโปรเจกต์ของบริษัทตัวเอง

  // 🌟 สำหรับการแก้ไข (ปรับให้รับ FormData เพื่อให้อัปโหลดไฟล์ใหม่ตอน Edit ได้)
  update: (id: string, data: FormData | any) => {
    // เช็คว่าเป็น FormData ไหม ถ้าใช่ให้ใส่ Header multipart
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return api.patch(`/projects/${id}`, data, config);
  },

  delete: (id: string) => api.delete(`/projects/${id}`),

  // --- ส่วนของ Advisor (อาจารย์) ---
  
  // ดึงโครงการที่ยังว่างอยู่ (ยังไม่มีอาจารย์รับ)
  getAvailableForAdvisors: () => api.get('/projects/available'), 

  // ดึงโครงการที่อาจารย์คนนี้เป็นที่ปรึกษาอยู่
  getMyAdvisorProjects: () => api.get('/projects/my-projects'), 

  // อนุมัติและรับเป็นที่ปรึกษา
 approveProject: (id: string, advisorId: string) => 
  api.patch(`/projects/${id}/approve`, { advisorId }),

  // ปฏิเสธโครงการพร้อมระบุเหตุผล
  rejectProject: (id: string, reason: string) => 
    api.patch(`/projects/${id}/reject`, { reason }),

  getAvailable: () => api.get('/projects/available'),

// ใน projectService.ts
updateStatus: (id: string, advisorId: string) => {
    // 🌟 ต้องส่งแบบมีปีกกาครอบ { advisorId } เพื่อให้เป็น JSON Body
    return api.patch(`/projects/${id}/approve`, { advisorId }); 
  },

  // ส่วนนี้ถ้า Backend แยก Table PM ออกมาต่างหาก (แต่ปกติเราส่งรวมไปใน create แล้ว)
  createPM: (data: any) => api.post('/project-manager', data),

  reject: (id: string) => {
    return api.patch(`/projects/${id}/reject`); 
  },
  applyProject: async (data: { projID: string; studentID: string }) => {
    // หมายเหตุ: ตรง '/applications' ให้เปลี่ยนเป็น Route API ฝั่ง Backend 
    // ของคุณที่ใช้สำหรับรับข้อมูลการสมัครนะครับ (เช่น '/projects/apply' หรือ '/applications')
    return await api.post('/applications', data);
  },

  // 1. ดึงข้อมูลโครงการที่ขอส่งลบ
  getPendingDeleteRequests: () => {
    return api.get('/projects/pending-delete'); 
  },

  // 2. อนุมัติการลบ
  approveDelete: (projID: string) => {
    return api.patch(`/projects/${projID}/approve-delete`); 
  },

  // 3. ปฏิเสธการลบ
  rejectDelete: (projID: string) => {
    return api.patch(`/projects/${projID}/reject-delete`); 
  },

  requestDelete: (id: string, reason: string) => {
    return api.patch(`/projects/${id}/request-delete`, { reason });
  }
};