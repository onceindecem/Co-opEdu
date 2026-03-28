import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; 
import { User, Building2, Phone, Mail, Briefcase, MapPin, Save, CheckCircle } from 'lucide-react';
import './Profile.css';

const StudentView = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [profile, setProfile] = useState({
    studentId: '66050xxx',
    firstName: 'สมชาย',
    lastName: 'สายโค้ด',
    email: '66050xxx@kmitl.ac.th',
    phone: '0812345678', 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true); 
  };

  return (
    <>
      <div className="profile-header">
        <div className="profile-avatar" style={{ background: '#f97316', color: 'white' }}>
          {profile.firstName[0]}{profile.lastName[0]}
        </div>
        <h2>โปรไฟล์ของฉัน</h2>
        <p>จัดการข้อมูลส่วนตัวและช่องทางการติดต่อ</p>
      </div>

      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal-content">
            <div className="success-modal-icon">
              <CheckCircle size={48} color="#22c55e" />
            </div>
            <h2>บันทึกข้อมูลสำเร็จ!</h2>
            <p>ข้อมูลโปรไฟล์ของคุณได้รับการอัปเดตเรียบร้อยแล้ว</p>
            <button onClick={() => setShowSuccessModal(false)} className="btn-success-ok">
              ตกลง
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3><User size={18} /> ข้อมูลส่วนตัว</h3>
          <div className="form-grid">
            <div className="input-group">
              <label>รหัสนักศึกษา (Student ID)</label>
              <input type="text" value={profile.studentId} disabled style={{ background: '#f1f5f9' }} />
            </div>
            <div className="input-group">
              <label>อีเมล (Email)</label>
              <input type="email" value={profile.email} disabled style={{ background: '#f1f5f9' }} />
            </div>
            <div className="input-group">
              <label>ชื่อ (First Name)</label>
              <input type="text" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>นามสกุล (Last Name)</label>
              <input type="text" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} required />
            </div>
            <div className="input-group">
              <label><Phone size={14} /> เบอร์โทรศัพท์ (Tel.)</label>
              <input 
                type="tel" 
                value={profile.phone} 
                maxLength={10}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value.replace(/[^0-9]/g, '') })} 
                required 
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn-save-profile" style={{ background: '#f97316', color: 'white', border: 'none' }}>
          <Save size={18} /> บันทึกการเปลี่ยนแปลง
        </button>
      </form>
    </>
  );
};

const CompanyView = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'สมชาย',
    lastName: 'สายชล',
    personalPhone: '0812345678', 
    position: 'HR Manager',
    companyName: 'บริษัท เอบีซี จำกัด',
    companyEmail: 'contact@abc.com',
    companyPhone: '021234567', 
    address: '123 ถ.ฉลองกรุง แขวงลำปลาทิว เขตลาดกระบัง กรุงเทพฯ'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true); 
  };

  return (
    <>
      <div className="profile-header">
        <div className="profile-avatar" style={{ background: '#f97316', color: 'white' }}>
          <Building2 size={32} />
        </div>
        <h2>โปรไฟล์บริษัท</h2>
        <p>จัดการข้อมูลผู้ประสานงานและข้อมูลสถานประกอบการ</p>
      </div>

      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal-content">
            <div className="success-modal-icon">
              <CheckCircle size={48} color="#22c55e" />
            </div>
            <h2>บันทึกข้อมูลสำเร็จ!</h2>
            <p>ข้อมูลโปรไฟล์บริษัทได้รับการอัปเดตเรียบร้อยแล้ว</p>
            <button onClick={() => setShowSuccessModal(false)} className="btn-success-ok">
              ตกลง
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3><User size={18} /> ข้อมูลผู้ประสานงาน</h3>
          <div className="form-grid">
            <div className="input-group">
              <label>ชื่อ (First Name)</label>
              <input type="text" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>นามสกุล (Last Name)</label>
              <input type="text" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} required />
            </div>
            <div className="input-group">
              <label><Phone size={14} /> เบอร์โทรส่วนตัว (Tel.)</label>
              <input 
                type="tel" 
                value={profile.personalPhone} 
                maxLength={10}
                onChange={(e) => setProfile({ ...profile, personalPhone: e.target.value.replace(/[^0-9]/g, '') })} 
                required 
              />
            </div>
            <div className="input-group">
              <label><Briefcase size={14} /> ตำแหน่ง (Position)</label>
              <input type="text" value={profile.position} onChange={(e) => setProfile({ ...profile, position: e.target.value })} required />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><Building2 size={18} /> ข้อมูลสถานประกอบการ</h3>
          <div className="form-grid">
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>ชื่อบริษัท (ภาษาไทย) </label>
              <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem' }}>(Company Name in Thai)</span>
              <input type="text" value={profile.companyName} onChange={(e) => setProfile({ ...profile, companyName: e.target.value })} required />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>ชื่อบริษัท (ภาษาอังกฤษ) </label>
              <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem' }}>(Company Name in English)</span>
              <input type="text" value={profile.companyName} onChange={(e) => setProfile({ ...profile, companyName: e.target.value })} required />
            </div>
            <div className="input-group">
              <label><Mail size={14} /> อีเมลบริษัท (Company Email)</label>
              <input type="email" value={profile.companyEmail} onChange={(e) => setProfile({ ...profile, companyEmail: e.target.value })} required />
            </div>
            <div className="input-group">
              <label><Phone size={14} /> เบอร์โทรบริษัท (Company Tel.)</label>
              <input 
                type="tel" 
                value={profile.companyPhone} 
                maxLength={10}
                onChange={(e) => setProfile({ ...profile, companyPhone: e.target.value.replace(/[^0-9]/g, '') })} 
                required 
              />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label><MapPin size={14} /> ที่อยู่บริษัท (Company Address)</label>
              <textarea rows={3} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} required />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-save-profile" style={{ background: '#f97316', color: 'white', border: 'none' }}>
          <Save size={18} /> บันทึกการเปลี่ยนแปลง
        </button>
      </form>
    </>
  );
};

export default function UserProfile() {
  const location = useLocation();
  
  let currentRole = '';
  if (location.pathname.includes('/student')) {
    currentRole = 'STUDENT';
  } else if (location.pathname.includes('/company')) {
    currentRole = 'COMPANY';
  } else if (location.pathname.includes('/advisor')) {
    currentRole = 'ADVISOR';
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {currentRole === 'STUDENT' && <StudentView />}
        {currentRole === 'COMPANY' && <CompanyView />}
        
        {currentRole !== 'STUDENT' && currentRole !== 'COMPANY' && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#ef4444' }}>ไม่มีสิทธิ์เข้าถึงหน้านี้</h3>
            <p style={{ color: '#64748b' }}>โปรดติดต่อผู้ดูแลระบบ</p>
          </div>
        )}
      </div>
    </div>
  );
}