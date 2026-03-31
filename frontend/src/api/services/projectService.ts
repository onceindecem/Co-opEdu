import api from '../axiosInstance';

export const projectService = {
  // สำหรับหน้า StudentProjects และ AvailableProjects
  getAll: () => api.get('/projects'),

  // สำหรับหน้า ProjectDetail (หรือหน้าอื่นๆ ที่ต้องการดึงข้อมูลโปรเจกต์เดียว)
  getOne: (id: string) => api.get(`/projects/${id}`),

  // 🌟 (เพิ่มเข้ามาให้ตรงกับหน้า Edit) ทำหน้าที่เหมือน getOne เลยครับ
  getById: (id: string) => api.get(`/projects/${id}`),

  // สำหรับหน้า CreateProject ของบริษัท
  create: (data: any) => api.post('/projects', data),
  createPM: (data: any) => api.post('/project-manager', data),

  // 🌟 สำหรับการ PATCH ข้อมูล (ใช้ได้ทั้งตอน Advisor เลือกรับโปรเจกต์ และตอนบริษัท Edit โปรเจกต์)
  update: (id: string, data: any) => api.patch(`/projects/${id}`, data),

  delete: (id: string) => api.delete(`/projects/${id}`),

  getAvailableForAdvisors: () => api.get('/projects/available'), 

  // 2. ดึงโครงการที่อาจารย์คนนี้เป็นที่ปรึกษาอยู่
  getMyAdvisorProjects: () => api.get('/projects/my-projects'), 

  // 3. อนุมัติและรับเป็นที่ปรึกษา
  approveProject: (id: string) => api.put(`/projects/${id}/approve`),
};