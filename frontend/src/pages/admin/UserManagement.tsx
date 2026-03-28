import React, { useState } from 'react';
import { Search, UserPlus, Key, Trash2, Users, AlertTriangle, X, ShieldCheck, RefreshCw } from 'lucide-react';
import './Admin.css';

export default function UserManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; userId: number | null; userName: string }>({
    isOpen: false, userId: null, userName: ''
  });

  const [roleConfirm, setRoleConfirm] = useState<{ isOpen: boolean; userId: number | null; userName: string; oldRole: string; newRole: string }>({
    isOpen: false, userId: null, userName: '', oldRole: '', newRole: ''
  });

  const [resetPwdConfirm, setResetPwdConfirm] = useState<{ isOpen: boolean; userId: number | null; userName: string }>({
    isOpen: false, userId: null, userName: ''
  });

  const [newPassword, setNewPassword] = useState(''); 

  const [userList, setUserList] = useState([
    { id: 1, name: 'สมชาย ใจดี', email: 'somchai@student.ac.th', role: 'STUDENT', provider: 'Local', date: '2026-03-25' },
    { id: 2, name: 'วิภาวี ขยันยิ่ง (HR)', email: 'hr@company.co.th', role: 'COMPANY', provider: 'Google', date: '2026-03-20' },
    { id: 3, name: 'สมหญิง รักเรียน', email: 'advisor.a@university.ac.th', role: 'ADVISOR', provider: 'Local', date: '2026-03-15' },
  ]);

  const confirmDelete = () => {
    if (deleteConfirm.userId) {
      setUserList(userList.filter(user => user.id !== deleteConfirm.userId));
      setDeleteConfirm({ isOpen: false, userId: null, userName: '' });
    }
  };

  const confirmRoleChange = () => {
    if (roleConfirm.userId) {
      setUserList(userList.map(user => 
        user.id === roleConfirm.userId ? { ...user, role: roleConfirm.newRole } : user
      ));
      setRoleConfirm({ ...roleConfirm, isOpen: false });
    }
  };

  const handleGeneratePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  const filteredUsers = userList.filter(user => 
    user.name.includes(searchTerm) || user.email.includes(searchTerm)
  );

  return (
    <div className="admin-card" style={{ position: 'relative' }}>
      <div className="admin-header-flex" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800 }}><Users size={24} style={{ marginRight: '8px' }} /> User Management</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>จัดการสิทธิ์และบัญชีผู้ใช้งาน</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: '#f97316', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={18} /> เพิ่ม User ใหม่
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="ค้นหาชื่อ หรือ Email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '320px', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
        />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ชื่อ-นามสกุล</th>
            <th>Email</th>
            <th>Role</th>
            <th>Provider</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td style={{ fontWeight: 700, color: '#1e293b' }}>{user.name}</td>
              <td style={{ color: '#64748b' }}>{user.email}</td>
              <td>
                <select 
                  value={user.role}
                  onChange={(e) => setRoleConfirm({ isOpen: true, userId: user.id, userName: user.name, oldRole: user.role, newRole: e.target.value })}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, cursor: 'pointer' }}
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="ADVISOR">ADVISOR</option>
                  <option value="COMPANY">COMPANY</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td>{user.provider}</td>
              <td style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => {
                    setResetPwdConfirm({ isOpen: true, userId: user.id, userName: user.name });
                    setNewPassword('');
                  }}
                  style={{ color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                >
                  <Key size={20} />
                </button>
                <button 
                  onClick={() => setDeleteConfirm({ isOpen: true, userId: user.id, userName: user.name })}
                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteConfirm.isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '20px', width: '400px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ background: '#fee2e2', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <AlertTriangle size={32} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#0f172a' }}>ยืนยันการลบบัญชี?</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '24px' }}>
              คุณกำลังจะลบบัญชีของ <strong>{deleteConfirm.userName}</strong> ข้อมูลทั้งหมดจะหายไปและไม่สามารถกู้คืนได้
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, cursor: 'pointer' }}>ยกเลิก</button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 600, cursor: 'pointer' }}>ลบถาวร</button>
            </div>
          </div>
        </div>
      )}

      {roleConfirm.isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '20px', width: '420px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ background: '#e0f2fe', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ShieldCheck size={32} color="#0284c7" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#0f172a' }}>ยืนยันเปลี่ยนสิทธิ์ใช้งาน</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
              ต้องการเปลี่ยนสิทธิ์ของ <strong>{roleConfirm.userName}</strong> <br />
              จาก <span style={{ textDecoration: 'line-through' }}>{roleConfirm.oldRole}</span> เป็น <strong>{roleConfirm.newRole}</strong> ใช่หรือไม่?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setRoleConfirm({ ...roleConfirm, isOpen: false })} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, cursor: 'pointer' }}>ยกเลิก</button>
              <button onClick={confirmRoleChange} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 600, cursor: 'pointer' }}>ยืนยันเปลี่ยนสิทธิ์</button>
            </div>
          </div>
        </div>
      )}

      {resetPwdConfirm.isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '20px', width: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ background: '#fef3c7', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Key size={30} color="#d97706" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#0f172a', textAlign: 'center' }}>Reset Password</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>
              กำหนดรหัสผ่านใหม่สำหรับคุณ <strong>{resetPwdConfirm.userName}</strong>
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: '#475569' }}>รหัสผ่านใหม่</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่" 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} 
                />
                <button 
                  onClick={handleGeneratePassword}
                  style={{ position: 'absolute', right: '10px', top: '10px', background: '#f1f5f9', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={14} /> สุ่มรหัส
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setResetPwdConfirm({ ...resetPwdConfirm, isOpen: false })} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, cursor: 'pointer' }}>ยกเลิก</button>
              <button 
                onClick={() => {
                  alert(`รหัสผ่านของ ${resetPwdConfirm.userName} ถูกเปลี่ยนเป็น: ${newPassword}`);
                  setResetPwdConfirm({ ...resetPwdConfirm, isOpen: false });
                }}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#f59e0b', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                ยืนยันการเปลี่ยน
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '420px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <X size={20} />
            </button>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={22} style={{ color: '#f97316' }} /> สร้างบัญชีผู้ใช้ใหม่
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>ชื่อ-นามสกุล / ชื่อบริษัท</label>
                <input type="text" placeholder="ระบุชื่อผู้ใช้งาน" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Email Address</label>
                <input type="email" placeholder="example@domain.com" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>รหัสผ่านเริ่มต้น</label>
                <input type="password" placeholder="กำหนดรหัสผ่าน" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>บทบาท (Role)</label>
                <select style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', outline: 'none' }}>
                  <option value="STUDENT">STUDENT (นักศึกษา)</option>
                  <option value="ADVISOR">ADVISOR (อาจารย์)</option>
                  <option value="COMPANY">COMPANY (บริษัท/สถานประกอบการ)</option>
                  <option value="ADMIN">ADMIN (ผู้ดูแลระบบ)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>ยกเลิก</button>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#f97316', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>สร้างบัญชี</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}