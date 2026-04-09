import api from '../axiosInstance';

export const applicationService = {

  // get application in project
  getApplicationsByProject: (projectId: string) => 
    api.get(`/applications/project/${projectId}`),

  getMyApplications: async () => {
    return api.get(`/applications/my-applications`);
  },

  createApplication: async (projID: string) => {
    return api.post(
      `/applications`,
      { projID: projID });
  },

  deleteApplication: async (appID: string) => {
    return api.delete(`/applications/${appID}`);
  },

  updateAppStat: async (appId: string, status: string) => {
    return await api.patch(`/applications/${appId}/status`, { status });
  },

  updateHiredStat: async (appId: string, hiredStat: string) => {
    return await api.patch(`/applications/${appId}/hired-status`, { hiredStat });
  }
  
};