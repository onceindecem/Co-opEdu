import api from '../axiosInstance';

export const projectService = {
  // สำหรับหน้า StudentProjects และ AvailableProjects
  getAll: () => api.get('/projects'),

  // สำหรับหน้า ProjectDetail
  getOne: (id: string) => api.get(`/projects/${id}`),

  // สำหรับหน้า CreateProject ของบริษัท
  create: (data: any) => api.post('/projects', data),
  createPM: (data: any) => api.post('/project-manager', data),

  // สำหรับการ PATCH ข้อมูล (เช่น Advisor เลือกรับโปรเจกต์)
  update: (id: string, data: any) => api.patch(`/projects/${id}`, data),
};