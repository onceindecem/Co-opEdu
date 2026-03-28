import './Company.css'; 
import { ClipboardList, Users, Wrench, UserCheck, MapPin, Upload, Save, ArrowLeft, Mail, Phone, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateProject() {
  const isEdit = false;
  const navigate = useNavigate();

  return (
    <div className="company-page-container">
      <div className="page-header" style={{ maxWidth: '900px', margin: '0 auto 30px' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-edit-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '5px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
        >
          <ArrowLeft size={18} /> กลับ
        </button>
        <h1 style={{ fontSize: '1.5rem', marginTop: '10px' }}>
          {isEdit ? 'แก้ไขโครงการ' : 'แบบฟอร์มเสนอโครงการสหกิจศึกษา หลักสูตรวิทยาการคอมพิวเตอร์'}
        </h1>
      </div>

      <div className="card form-card" style={{ maxWidth: '900px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        {isEdit && (
          <div className="alert-info">
            <Info size={16} /> <strong>หมายเหตุ:</strong> การแก้ไขข้อมูลจะทำให้สถานะกลับเป็น <strong>PENDING</strong>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); alert("บันทึกข้อมูลเรียบร้อย!"); navigate('/company/projects'); }}>
          
          <div className="form-section-title">
            <ClipboardList size={20} /> รายละเอียดโครงการที่เสนอ
          </div>

          <div className="form-group span-full">
            <label>ชื่อโครงการ*</label>
            <input type="text" placeholder="เช่น Web Application for Inventory Management" required />
          </div>

          <div className="form-group span-full">
            <label>วัตถุประสงค์ของโครงการ *</label>
            <textarea rows={3} placeholder="ระบุสิ่งที่บริษัทต้องการได้รับจากโครงการนี้..." required />
          </div>

          <div className="input-row">
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Users size={16} /> จำนวนนักศึกษาที่รับ (คน) *
              </label>
              <input type="number" min="1" placeholder="1" required />
            </div>
            <div className="form-group">
              <label>ค่าตอบแทน (บาท/เดือน หรือ วัน)</label>
              <input type="text" placeholder="เช่น 300 บาท/วัน (ถ้ามี)" />
            </div>
          </div>

          <div className="form-group span-full">
            <label>ลักษณะงานที่ต้องปฏิบัติ (Job Description) *</label>
            <textarea rows={5} placeholder="ระบุรายละเอียดหน้าที่ความรับผิดชอบของนักศึกษา..." required />
          </div>

          <div className="form-group span-full">
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Wrench size={16} /> เครื่องมือและทักษะที่ต้องใช้ (Skills) *
            </label>
            <input type="text" placeholder="เช่น React, Node.js, SQL, Docker" required />
          </div>

          <div className="form-section-title" style={{ marginTop: '40px' }}>
            <UserCheck size={20} /> ข้อมูลพนักงานที่ปรึกษา (พี่เลี้ยง)
          </div>
          <p className="section-subtitle" style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '15px' }}>
            ทำหน้าที่ดูแลและแนะนำในการปฏิบัติงานตลอดระยะเวลาโครงการ
          </p>

          <div className="input-row">
            <div className="form-group">
              <label>ชื่อ-นามสกุล พี่เลี้ยง *</label>
              <input type="text" placeholder="ระบุชื่อผู้ดูแล" required />
            </div>
            <div className="form-group">
              <label>ตำแหน่งงานพี่เลี้ยง *</label>
              <input type="text" placeholder="Senior Developer / Manager" required />
            </div>
          </div>

          <div className="input-row">
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={14} /> เบอร์โทรศัพท์ติดต่อ *
              </label>
              <input type="tel" placeholder="08x-xxx-xxxx" required />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={14} /> อีเมลติดต่อ *
              </label>
              <input type="email" placeholder="mentor@company.com" required />
            </div>
          </div>

          <div className="form-section-title" style={{ marginTop: '40px' }}>
            <MapPin size={20} /> สถานที่ปฏิบัติงาน
          </div>
          <div className="form-group span-full">
            <label>ระบุสถานที่ปฏิบัติงาน (หากต่างจากที่อยู่บริษัทที่ลงทะเบียนไว้)</label>
            <textarea rows={2} placeholder="เลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ..." />
          </div>

          <div className="form-section-title" style={{ marginTop: '40px', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
            <strong>*หมายเหตุ:</strong> รายละเอียดของโครงการสามารถแนบเป็นเอกสารแนบมาได้ และในกรณีที่บริษัทนำเสนอโครงการสหกิจเป็นครั้งแรกให้กับทางภาควิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์ สจล. กรุณาแนบเอกสารแนะนำบริษัทของท่านมาในเอกสารแนบด้วย
          </div>
          
          <div className="file-upload-zone" style={{ border: '2px dashed #cbd5e1', padding: '30px', textAlign: 'center', borderRadius: '15px', marginTop: '15px', background: '#f8fafc', transition: '0.2s' }}>
            <label style={{ cursor: 'pointer', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Upload size={30} style={{ marginBottom: '10px', color: '#f97316' }} />
              <p style={{ margin: 0, fontWeight: 500 }}>คลิกเพื่ออัปโหลดเอกสารแนบ</p>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>(รองรับ PDF ขนาดไม่เกิน 5MB)</span>
              <input type="file" hidden multiple />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '25px' }}>
            <button type="button" onClick={() => navigate(-1)} style={{ background: '#f1f5f9', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', color: '#475569' }}>
              ยกเลิก
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f97316', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
              <Save size={18} /> {isEdit ? 'บันทึกการแก้ไข' : 'ส่งโครงการให้คณะพิจารณา'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}