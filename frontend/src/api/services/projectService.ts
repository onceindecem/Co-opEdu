import api from '../axiosInstance';

export const projectService = {
  getAll: () => api.get('/projects'),

  getOne: (id: string) => api.get(`/projects/${id}`),
  getById: (id: string) => api.get(`/projects/${id}`),

  create: (formData: FormData) => {
    return api.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getHRProjects: () => api.get('/projects/hr-projects'),

  update: (id: string, data: FormData | any) => {
    const config = data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return api.patch(`/projects/${id}`, data, config);
  },

  delete: (id: string) => api.delete(`/projects/${id}`),

  // for advisor

  // get project for approve
  getAvailableForAdvisors: () => api.get('/projects/available'),

  // get advisor project
  getMyAdvisorProjects: () => api.get('/projects/my-projects'),

  approveProject: (id: string) =>
    api.patch(`/projects/${id}/approve`),

  rejectProject: (id: string) => {
    return api.patch(`/projects/${id}/reject`);
  },

  //

  createPM: (data: any) => api.post('/project-manager', data),

  applyProject: async (data: { projID: string; studentID: string }) => {
    return await api.post('/applications', data);
  },

  getPendingDeleteRequests: () => {
    return api.get('/projects/pending-delete');
  },

  approveDelete: (projID: string) => {
    return api.patch(`/projects/${projID}/approve-delete`);
  },

  rejectDelete: (projID: string) => {
    return api.patch(`/projects/${projID}/reject-delete`);
  },

  requestDelete: (id: string, reason: string) => {
    return api.patch(`/projects/${id}/request-delete`, { reason });
  }
};