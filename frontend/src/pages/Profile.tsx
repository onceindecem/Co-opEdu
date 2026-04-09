import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { User, Building2, Phone, Mail, Briefcase, MapPin, Save, CheckCircle } from 'lucide-react';
import './Profile.css';
import { authService } from '../api/services/authService';
import { hrService } from '../api/services/hrService';

const StudentView = ({ accountInfo, profileData }: { accountInfo: any, profileData: any }) => {

  return (
    <>
      <div className="profile-header">
        <div className="profile-avatar" style={{ background: '#f97316', color: 'white' }}>
          {profileData?.firstName?.[0] || 'S'}{profileData?.lastName?.[0] || 'T'}
        </div>
        <h2>โปรไฟล์ของฉัน</h2>
        <p>ข้อมูลนักศึกษา</p>
      </div>

      <div className="profile-form">
        <div className="form-section">
          <h3><User size={18} /> ข้อมูลส่วนตัว</h3>
          <div className="form-grid">
            <div className="input-group">
              <label>รหัสนักศึกษา (Student ID)</label>
              <input type="text" value={profileData?.studentID || '-'} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>
            <div className="input-group">
              <label>อีเมล (Email)</label>
              <input type="email" value={accountInfo?.email || '-'} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>
            <div className="input-group">
              <label>ชื่อ (First Name)</label>
              <input type="text" value={profileData?.firstName || '-'} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>
            <div className="input-group">
              <label>นามสกุล (Last Name)</label>
              <input type="text" value={profileData?.lastName || '-'} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CompanyView = ({ accountInfo, profileData }: { accountInfo: any, profileData: any }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [profile, setProfile] = useState({
    firstName: profileData?.hrFirstName || '', 
    lastName: profileData?.hrLastName || '',
    personalPhone: profileData?.hrTel || '', 
    position: profileData?.hrPosition || '',
    companyNameTH: profileData?.company?.coNameTH || '', 
    companyNameEN: profileData?.company?.coNameEN || '', 
    companyEmail: profileData?.company?.coEmail || '', 
    companyPhone: profileData?.company?.coTel || '', 
    address: profileData?.company?.coAddr || ''
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    try {
      const payload = {
        hrFirstName: profile.firstName,
        hrLastName: profile.lastName,
        hrTel: profile.personalPhone,
        hrPosition: profile.position,
        coNameTH: profile.companyNameTH,
        coNameEN: profile.companyNameEN,
        coEmail: profile.companyEmail,
        coTel: profile.companyPhone,
        coAddr: profile.address,
      };

      await hrService.updateCompanyProfile(payload);

      setShowSuccessModal(true); 

    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
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

      {errorMessage && (
        <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px' }}>
          {errorMessage}
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
              <input type="text" value={profile.companyNameTH} onChange={(e) => setProfile({ ...profile, companyNameTH: e.target.value })} required />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>ชื่อบริษัท (ภาษาอังกฤษ) </label>
              <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem' }}>(Company Name in English)</span>
              <input type="text" value={profile.companyNameEN} onChange={(e) => setProfile({ ...profile, companyNameEN: e.target.value })} required />
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

        <button 
          type="submit" 
          className="btn-save-profile" 
          style={{ 
            background: isSaving ? '#fdba74' : '#f97316',
            color: 'white', 
            border: 'none',
            cursor: isSaving ? 'not-allowed' : 'pointer'
          }}
          disabled={isSaving}
        >
          <Save size={18} /> {isSaving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการเปลี่ยนแปลง'}
        </button>
      </form>
    </>
  );
};

export default function UserProfile() {
  const navigate = useNavigate();
  const [dbData, setDbData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<string>(''); // 💡 เปลี่ยนมาเก็บ role ใน state แทน

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await authService.getProfile();
        
        setDbData(response.data);
        
        setCurrentRole(response.data.accountInfo.role); 

      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate('/login', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>กำลังโหลดข้อมูล... ⏳</div>;
  }

  if (!dbData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p style={{ color: 'red' }}>ไม่สามารถโหลดข้อมูลโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง</p>
        <button onClick={() => window.location.reload()}>ลองใหม่</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {currentRole === 'STUDENT' && (
          <StudentView accountInfo={dbData.accountInfo} profileData={dbData.profile}/>
        )}
        
        {currentRole === 'HR' && (
          <CompanyView accountInfo={dbData.accountInfo} profileData={dbData.profile}/>
        )}
        
        {currentRole !== 'STUDENT' && currentRole !== 'HR' && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#ef4444' }}>ไม่มีสิทธิ์เข้าถึงหน้านี้</h3>
            <p style={{ color: '#64748b' }}>บทบาทของคุณคือ: {currentRole}</p>
          </div>
        )}
      </div>
    </div>
  );
}