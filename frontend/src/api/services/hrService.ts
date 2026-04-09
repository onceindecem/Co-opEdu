import axiosInstance from '../axiosInstance'; 

export const hrService = {
  updateCompanyProfile: async (data: any) => {
    return await axiosInstance.patch('/hr/profile', data);
  }
};