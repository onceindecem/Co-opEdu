import { User, Building2, Phone, Mail, Briefcase, MapPin, Save } from 'lucide-react';
import './Company.css'; // หรือ './Profile.css' ขึ้นอยู่กับว่าคุณเก็บสไตล์รวมไว้ที่ไหน

export default function CompanyProfile() {
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว!");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar" style={{ background: 'var(--company-orange, #f97316)', color: 'white' }}>
            <Building2 size={32} />
          </div>
          <h2>โปรไฟล์บริษัท</h2>
          <p>จัดการข้อมูลผู้ประสานงานและข้อมูลสถานประกอบการ</p>
        </div>

        <form onSubmit={handleUpdate} className="profile-form">
          <div className="form-section">
            <h3><User size={18} /> ข้อมูลผู้ประสานงาน</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>ชื่อ (First Name)</label>
                <input type="text" defaultValue="สมชาย" required />
              </div>
              <div className="input-group">
                <label>นามสกุล (Last Name)</label>
                <input type="text" defaultValue="สายชล" required />
              </div>
              <div className="input-group">
                <label><Phone size={14} /> เบอร์โทรศัพท์ส่วนตัว</label>
                <input type="tel" defaultValue="081-234-5678" required />
              </div>
              <div className="input-group">
                <label><Briefcase size={14} /> ตำแหน่ง</label>
                <input type="text" defaultValue="HR Manager" required />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3><Building2 size={18} /> ข้อมูลสถานประกอบการ</h3>
            <div className="form-grid">
              {/* ใช้ inline style ช่วยให้ช่องนี้กินพื้นที่เต็มบรรทัดใน Grid */}
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>ชื่อบริษัท (ภาษาไทย)</label>
                <input type="text" defaultValue="บริษัท เอบีซี จำกัด" required />
              </div>
              <div className="input-group">
                <label><Mail size={14} /> อีเมลบริษัท</label>
                <input type="email" defaultValue="contact@abc.com" required />
              </div>
              <div className="input-group">
                <label><Phone size={14} /> เบอร์โทรบริษัท</label>
                <input type="tel" defaultValue="02-123-4567" required />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label><MapPin size={14} /> ที่อยู่บริษัท</label>
                <textarea rows={3} defaultValue="123 ถ.ฉลองกรุง แขวงลำปลาทิว เขตลาดกระบัง กรุงเทพฯ" required />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-save-profile" 
            style={{ background: 'var(--company-orange, #f97316)', border: 'none' }} // เพิ่มสีส้มให้ตรงตีมบริษัท
          >
            <Save size={18} /> อัปเดตข้อมูลโปรไฟล์
          </button>
        </form>

      </div>
    </div>
  );
}