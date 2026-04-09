import { createContext, useContext } from 'react';

// 🌟 1. เพิ่ม checkAuth เข้าไปใน Type เพื่อบอก TypeScript ว่า "เรามีฟังก์ชันนี้นะ!"
type AuthContextType = {
  user: any;        
  profile: any;   
  loading: boolean;
  checkAuth: () => Promise<string | null>; // <-- เพิ่มบรรทัดนี้ครับ
};

// 🌟 2. เพิ่มค่าเริ่มต้นของ checkAuth เข้าไปใน createContext ด้วย 
// (ใส่เป็น async () => null หลอกๆ ไว้ก่อน เดี๋ยว AuthProvider จะเอาของจริงมาทับเอง)
export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  checkAuth: async () => null, // <-- เพิ่มบรรทัดนี้ด้วยครับ
});

export const useAuth = () => useContext(AuthContext);