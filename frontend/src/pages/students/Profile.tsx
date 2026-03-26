import { useState } from 'react';
import { User, GraduationCap, Phone, Mail, Save } from 'lucide-react';
import './Profile.css';

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    studentId: '66050xxx',
    firstName: 'สมชาย',
    lastName: 'สายโค้ด',
    email: '66050xxx@kmitl.ac.th',
    phone: '081-234-5678',
    major: 'Computer Engineering',
    gpax: '3.50',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <h2>โปรไฟล์ของฉัน</h2>
          <p>จัดการข้อมูลส่วนตัวและข้อมูลการเรียนของคุณ</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3><User size={18} /> ข้อมูลส่วนตัว</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>รหัสนักศึกษา</label>
                <input type="text" value={profile.studentId} disabled />
              </div>
              <div className="input-group">
                <label>อีเมล</label>
                <input type="email" value={profile.email} disabled />
              </div>
              <div className="input-group">
                <label>ชื่อ</label>
                <input type="text" value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} />
              </div>
              <div className="input-group">
                <label>นามสกุล</label>
                <input type="text" value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} />
              </div>
              <div className="input-group">
                <label><Phone size={14} /> เบอร์โทรศัพท์</label>
                <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3><GraduationCap size={18} /> ข้อมูลการศึกษา</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>สาขาวิชา</label>
                <select value={profile.major} onChange={(e) => setProfile({...profile, major: e.target.value})}>
                    <option value="Computer Science">Computer Science</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
              <div className="input-group">
                <label>เกรดเฉลี่ยสะสม (GPAX)</label>
                <input type="number" step="0.01" value={profile.gpax} onChange={(e) => setProfile({...profile, gpax: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-save-profile">
            <Save size={18} /> บันทึกการเปลี่ยนแปลง
          </button>
        </form>
      </div>
    </div>
  );
}