// src/api/services/adminService.ts
import api from '../axiosInstance'; 

export const adminService = {
  // 1. ดึงรายชื่อผู้ใช้งานทั้งหมด
  getAllUsers: async () => {
    return await api.get('/users'); 
  },

  // 2. สร้างบัญชีผู้ใช้ใหม่ (จาก Modal เพิ่ม User)
  createUser: async (userData: any) => {
    return await api.post('/users', userData);
  },

  // 3. เปลี่ยนสิทธิ์ (Role) ผู้ใช้งาน
  updateUserRole: async (userId: number | string, newRole: string) => {
    // 🌟 แก้โดยเอา /role ออก ยิงเข้า Route อัปเดตข้อมูลทั่วไป
    return await api.patch(`/users/${userId}`, { role: newRole });
  },

  // 4. รีเซ็ตรหัสผ่าน
  resetPassword: async (userId: number | string, newPassword: string) => {
    // 🌟 แก้โดยเอา /reset-password ออก ยิงเข้า Route อัปเดตข้อมูลทั่วไป
    return await api.patch(`/users/${userId}`, { password: newPassword });
  },

  // 5. ลบบัญชีผู้ใช้
  deleteUser: async (userId: number | string) => {
    return await api.delete(`/users/${userId}`);
  }
};