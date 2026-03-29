import { useState } from 'react';
import './Company.css'; 
import { ClipboardList, Users, Wrench, MapPin, Upload, Save, ArrowLeft, Mail, Phone, Info, Building2, UserCircle, UserCheck, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateProject() {
  const isEdit = false;
  const navigate = useNavigate();

  const [contactMethod, setContactMethod] = useState<'manager' | 'coordinator'>('manager');

  const [mentors, setMentors] = useState([
    { id: Date.now(), name: '', position: '', phone: '', email: '' }
  ]);

  const companyData = {
    nameTh: "บริษัท เทคโนโลยีและนวัตกรรม จำกัด",
    nameEn: "Technology and Innovation Co., Ltd.",
    address: "123 อาคารซอฟต์แวร์พาร์ค ชั้น 10 ถนนแจ้งวัฒนะ ปากเกร็ด นนทบุรี 11120",
    phone: "021234567", 
    email: "contact@techinnovation.co.th"
  };

  const handleAddMentor = () => {
    setMentors([...mentors, { id: Date.now(), name: '', position: '', phone: '', email: '' }]);
  };

  const handleRemoveMentor = (id: number) => {
    if (mentors.length > 1) {
      setMentors(mentors.filter(mentor => mentor.id !== id));
    }
  };

  const handleMentorChange = (id: number, field: string, value: string) => {
    setMentors(mentors.map(mentor => 
      mentor.id === id ? { ...mentor, [field]: value } : mentor
    ));
  };

  return (
    <div className="company-page-container">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={18} /> กลับ
        </button>
        <h1 className="page-title">
          {isEdit ? 'แก้ไขโครงการ' : 'แบบฟอร์มเสนอโครงการสหกิจศึกษา หลักสูตรวิทยาการคอมพิวเตอร์'}
        </h1>
      </div>

      <div className="card form-card">
        {isEdit && (
          <div className="alert-info">
            <Info size={16} /> <strong>หมายเหตุ:</strong> การแก้ไขข้อมูลจะทำให้สถานะกลับเป็น <strong>PENDING</strong>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); console.log({ mentors }); alert("บันทึกข้อมูลเรียบร้อย!"); navigate('/company/projects'); }}>
          
          {/* =========================================
              1. ข้อมูลสถานประกอบการ/หน่วยงาน
          ========================================= */}
          <div className="form-section-title">
            <Building2 size={20} /> ข้อมูลสถานประกอบการ/หน่วยงาน
          </div>
          <p className="section-subtitle">
            ดึงข้อมูลจากฐานข้อมูลขององค์กร (ไม่สามารถแก้ไขในหน้านี้ได้)
          </p>

          <div className="input-row">
            <div className="form-group">
              <label>ชื่อสถานประกอบการ/หน่วยงาน (ภาษาไทย)</label>
              <input type="text" value={companyData.nameTh} readOnly className="input-readonly" />
            </div>
            <div className="form-group">
              <label>ชื่อสถานประกอบการ/หน่วยงาน (ภาษาอังกฤษ)</label>
              <input type="text" value={companyData.nameEn} readOnly className="input-readonly" />
            </div>
          </div>

          <div className="form-group span-full">
            <label>ที่อยู่</label>
            <textarea rows={2} value={companyData.address} readOnly className="input-readonly" />
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>เบอร์โทรศัพท์</label>
              <input type="text" value={companyData.phone} readOnly className="input-readonly" />
            </div>
            <div className="form-group">
              <label>อีเมล</label>
              <input type="email" value={companyData.email} readOnly className="input-readonly" />
            </div>
          </div>

          {/* =========================================
              2. รายละเอียดโครงการที่เสนอ
          ========================================= */}
          <div className="form-section-title mt-40">
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

          <div className="form-group span-full">
            <label className="label-with-icon">
              <Users size={16} /> จำนวนนักศึกษาที่รับ (คน) *
            </label>
            <input type="number" min="1" placeholder="1" required className="input-half" />
          </div>

          <div className="form-group span-full">
            <label>ลักษณะงานที่ต้องปฏิบัติ (Job Description) *</label>
            <textarea rows={5} placeholder="ระบุรายละเอียดหน้าที่ความรับผิดชอบของนักศึกษา..." required />
          </div>

          <div className="form-group span-full">
            <label className="label-with-icon">
              <Wrench size={16} /> เครื่องมือและทักษะที่ต้องใช้ (Skills) *
            </label>
            <input type="text" placeholder="เช่น React, Node.js, SQL, Docker" required />
          </div>

          {/* =========================================
              3. ข้อมูลพนักงานที่ปรึกษา (พี่เลี้ยง)
          ========================================= */}
          <div className="form-section-header-flex mt-40">
            <div className="section-title-icon-wrapper">
              <UserCheck size={20} /> ข้อมูลพนักงานที่ปรึกษา (พี่เลี้ยง)
            </div>
            <button type="button" onClick={handleAddMentor} className="btn-add-mentor">
              <Plus size={16} /> เพิ่มพี่เลี้ยง
            </button>
          </div>
          <p className="section-subtitle">
            ทำหน้าที่ดูแลและแนะนำในการปฏิบัติงานตลอดระยะเวลาโครงการ (สามารถเพิ่มได้มากกว่า 1 คน)
          </p>

          {mentors.map((mentor, index) => (
            <div key={mentor.id} className="mentor-card">
              <div className="mentor-card-header">
                <h4 className="mentor-card-title">คนที่ {index + 1}</h4>
                {mentors.length > 1 && (
                  <button type="button" onClick={() => handleRemoveMentor(mentor.id)} className="btn-remove-mentor">
                    <Trash2 size={16} /> ลบ
                  </button>
                )}
              </div>

              <div className="input-row">
                <div className="form-group">
                  <label>ชื่อ-นามสกุล พี่เลี้ยง *</label>
                  <input type="text" placeholder="ระบุชื่อผู้ดูแล" value={mentor.name} onChange={(e) => handleMentorChange(mentor.id, 'name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>ตำแหน่งงานพี่เลี้ยง *</label>
                  <input type="text" placeholder="Senior Developer / Manager" value={mentor.position} onChange={(e) => handleMentorChange(mentor.id, 'position', e.target.value)} required />
                </div>
              </div>

              <div className="input-row">
                <div className="form-group">
                  <label className="label-with-icon"><Phone size={14} /> เบอร์โทรศัพท์ติดต่อ *</label>
                  <input type="tel" placeholder="08xxxxxxxx" maxLength={10} pattern="[0-9]*" value={mentor.phone} onChange={(e) => handleMentorChange(mentor.id, 'phone', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="label-with-icon"><Mail size={14} /> อีเมลติดต่อ *</label>
                  <input type="email" placeholder="mentor@company.com" value={mentor.email} onChange={(e) => handleMentorChange(mentor.id, 'email', e.target.value)} required />
                </div>
              </div>
            </div>
          ))}

          {/* =========================================
              4. ข้อมูลผู้จัดการโครงการ/หัวหน้าหน่วยงาน
          ========================================= */}
          <div className="form-section-title mt-40">
            <UserCircle size={20} /> ข้อมูลผู้จัดการโครงการ/หัวหน้าหน่วยงาน/ผู้จัดการ
          </div>

          <div className="form-group span-full">
            <label>ชื่อ-นามสกุล *</label>
            <input type="text" placeholder="ระบุชื่อ-นามสกุล ผู้จัดการโครงการ" required />
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>ตำแหน่ง *</label>
              <input type="text" placeholder="เช่น Project Manager, CTO" required />
            </div>
            <div className="form-group">
              <label>แผนก/ฝ่าย *</label>
              <input type="text" placeholder="เช่น Software Development" required />
            </div>
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>เบอร์โทรศัพท์ติดต่อ *</label>
              <input type="tel" placeholder="08xxxxxxxx" maxLength={10} pattern="[0-9]*" required />
            </div>
            <div className="form-group">
              <label>อีเมลติดต่อ *</label>
              <input type="email" placeholder="manager@company.com" required />
            </div>
          </div>

          {/* =========================================
              5. การติดต่อประสานงาน
          ========================================= */}
          <div className="form-section-title mt-40">
            <Phone size={20} /> การติดต่อประสานงาน
          </div>
          
          <div className="form-group span-full">
            <label>หากมหาวิทยาลัยฯ ประสงค์จะติดต่อประสานงานในรายละเอียดกับสถานประกอบการ/หน่วยงาน ขอให้ติดต่อที่ใคร *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="contactMethod" value="manager" checked={contactMethod === 'manager'} onChange={() => setContactMethod('manager')} className="radio-input" />
                1. ติดต่อโดยตรงกับผู้จัดการโครงการ/หัวหน้าหน่วยงาน/ผู้จัดการ
              </label>
              <label className="radio-label">
                <input type="radio" name="contactMethod" value="coordinator" checked={contactMethod === 'coordinator'} onChange={() => setContactMethod('coordinator')} className="radio-input" />
                2. ติดต่อกับบุคคลที่ สถานประกอบการ/หน่วยงาน มอบหมายต่อไปนี้
              </label>
            </div>
          </div>

          {contactMethod === 'coordinator' && (
            <div className="coordinator-card">
              <h4 className="coordinator-title">รายละเอียดผู้ประสานงานของสถานประกอบการ/หน่วยงาน</h4>
              <div className="form-group span-full">
                <label>ชื่อ-นามสกุล ผู้ประสานงาน *</label>
                <input type="text" placeholder="ระบุชื่อ-นามสกุล ผู้ประสานงาน (เช่น HR)" required />
              </div>
              <div className="input-row">
                <div className="form-group">
                  <label>ตำแหน่ง *</label>
                  <input type="text" placeholder="เช่น HR Manager, Recruiter" required />
                </div>
                <div className="form-group">
                  <label>แผนก/ฝ่าย *</label>
                  <input type="text" placeholder="เช่น Human Resources" required />
                </div>
              </div>
              <div className="input-row">
                <div className="form-group">
                  <label>เบอร์โทรศัพท์ติดต่อ *</label>
                  <input type="tel" placeholder="08xxxxxxxx" maxLength={10} pattern="[0-9]*" required />
                </div>
                <div className="form-group">
                  <label>อีเมลติดต่อ *</label>
                  <input type="email" placeholder="hr@company.com" required />
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              6. สถานที่ปฏิบัติงาน และ เอกสารแนบ
          ========================================= */}
          <div className="form-section-title mt-40">
            <MapPin size={20} /> สถานที่ปฏิบัติงาน
          </div>
          <div className="form-group span-full">
            <label>ระบุสถานที่ปฏิบัติงาน (หากต่างจากที่อยู่บริษัทที่ลงทะเบียนไว้)</label>
            <textarea rows={2} placeholder="เลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ..." />
          </div>

          <div className="note-info-box">
            <strong>*หมายเหตุ:</strong> รายละเอียดของโครงการสามารถแนบเป็นเอกสารแนบมาได้ และในกรณีที่บริษัทนำเสนอโครงการสหกิจเป็นครั้งแรกให้กับทางภาควิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์ สจล. กรุณาแนบเอกสารแนะนำบริษัทของท่านมาในเอกสารแนบด้วย
          </div>
          
          <div className="file-upload-zone">
            <label className="upload-label">
              <Upload size={30} className="upload-icon" />
              <p className="upload-text">คลิกเพื่ออัปโหลดเอกสารแนบ</p>
              <span className="upload-subtext">(รองรับ PDF ขนาดไม่เกิน 5MB)</span>
              <input type="file" hidden multiple />
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
              ยกเลิก
            </button>
            <button type="submit" className="btn-primary">
              <Save size={18} /> {isEdit ? 'บันทึกการแก้ไข' : 'ส่งโครงการให้คณะพิจารณา'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}