// src/api/services/adminService.ts
import api from '../axiosInstance'; 

export const adminService = {
  // 1. ดึงรายชื่อผู้ใช้งานทั้งหมด
  getAllUsers: async () => {
    return await api.get('/users'); 
  },

  // 2. สร้างบัญชีผู้ใช้ใหม่ (จาก Modal เพิ่ม User)
 createUser: async (userData: any) => {
    // เดิมอาจจะเป็น: return axios.post('/users', userData, ...);
    return api.post('/users/admin', userData, {
      headers: {
        // ... (อย่าลืมแนบ Authorization: Bearer <token> ด้วยนะครับ เพราะ Route นี้โดน Guard บังคับไว้)
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // 3. เปลี่ยนสิทธิ์ (Role) ผู้ใช้งาน
 updateUserRole: async (userId: string, newRole: string) => {
    // 🌟 ต้องยิงไปที่ PATCH /users/:id
    return api.patch(`/users/${userId}`, 
      { role: newRole }, // ส่งข้อมูล role ใหม่ไป
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // ต้องมี Token เพราะโดน Guard บังคับ
        }
      }
    );
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