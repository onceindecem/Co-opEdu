import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, MapPin, Users, Wrench, 
  UserCheck, Phone, Mail, FileText, CheckCircle, 
  Briefcase, GraduationCap, Paperclip
} from 'lucide-react';
import './students/Projects.css';

export default function ProjectDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  let currentRole = '';
  if (location.pathname.includes('/student')) {
    currentRole = 'STUDENT';
  } else if (location.pathname.includes('/advisor')) {
    currentRole = 'ADVISOR';
  }

  const [project] = useState({
    id: 1,
    title: 'AI Chatbot for Customer Service',
    company: 'Tech Innovate Co., Ltd.',
    objective: 'พัฒนาระบบ AI Chatbot เพื่อช่วยตอบคำถามลูกค้าอัตโนมัติตลอด 24 ชั่วโมง ลดภาระของพนักงานและเพิ่มความรวดเร็วในการให้บริการ',
    studentsNeeded: 2,
    allowance: '500 บาท/วัน',
    jobDescription: '1. ออกแบบและพัฒนา Chatbot Flow\n2. เทรนโมเดล AI ด้วยข้อมูลของบริษัท\n3. เชื่อมต่อ API กับระบบฐานข้อมูลลูกค้า',
    skills: 'Python, TensorFlow, React, Node.js, Dialogflow',
    workLocation: '123 อาคารซอฟต์แวร์ ชั้น 5 เขตปทุมวัน กรุงเทพมหานคร 10330',
    mentorName: 'คุณสมศักดิ์ นำพา',
    mentorPosition: 'Senior AI Engineer',
    mentorDepartment: 'Research and Development (R&D)',
    mentorPhone: '0819997999',
    mentorEmail: 'somsak@techinnovate.com',
    advisorName: 'รศ.ดร. ใจดี รักเรียน',
    advisorEmail: 'jaidee.ru@kmitl.ac.th',
    attachments: 'company_profile_2026.pdf'
  });

  const handleApprove = () => {
    navigate('/advisor/projects');
  };

  const handleApplyClick = () => {
    const savedApps = JSON.parse(localStorage.getItem('myApplications') || '[]');
    
    if (savedApps.length >= 2) {
      alert('คุณสามารถสมัครโครงการได้สูงสุด 2 รายการเท่านั้น');
      return;
    }

    const isAlreadyApplied = savedApps.some((app: any) => app.title === project.title);
    if (isAlreadyApplied) {
      alert('คุณได้ทำการสมัครโครงการนี้ไปแล้ว!');
      return;
    }

    setIsConfirmOpen(true);
  };

  const confirmApply = () => {
    const savedApps = JSON.parse(localStorage.getItem('myApplications') || '[]');
    const newApplication = {
      id: Date.now(), 
      title: project.title,
      company: project.company,
      status: "PENDING",
      date: new Date().toLocaleDateString('th-TH')
    };

    localStorage.setItem('myApplications', JSON.stringify([...savedApps, newApplication]));
    setIsConfirmOpen(false); 
    navigate('/student/applications'); 
  };

  return (
    <div className="project-detail-container">
      
      {/* 🟠 Popup ยืนยันการสมัครโครงการ */}
      {isConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon-wrapper">
              <Briefcase size={32} color="#f97316" />
            </div>
            
            <h3>ยืนยันการสมัครโครงการ</h3>
            <p>
              ต้องการส่งใบสมัครเข้าโครงการ <br/>
              <strong style={{ color: '#0f172a' }}>{project.title}</strong> <br/>
              ของ <strong>{project.company}</strong> ใช่หรือไม่?
            </p>
            
            <div className="modal-actions">
              <button className="btn-outline-cancel" onClick={() => setIsConfirmOpen(false)}>
                ยกเลิก
              </button>
              <button className="btn-confirm-apply" onClick={confirmApply}>
                ยืนยันการสมัคร
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ปุ่มย้อนกลับ */}
      <button className="btn-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> กลับ
      </button>

      <div className="detail-card">
        
        {/* หัวข้อโครงการและบริษัท */}
        <div className="detail-header-section">
          <h1>{project.title}</h1>
          <div className="company-badge">
            <Building2 size={20} color="#f97316" />
            <strong>{project.company}</strong>
          </div>
        </div>

        {/* ข้อมูลทั่วไปของโครงการ */}
        <div className="detail-section">
          <h3><FileText size={20} color="#3b82f6" /> รายละเอียดโครงการ</h3>
          <div className="info-box">
            <div>
              <strong className="info-label">วัตถุประสงค์:</strong>
              <p className="info-value">{project.objective}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              <div>
                <strong className="info-label"><Users size={16}/> จำนวนที่รับ:</strong>
                <p className="info-value">{project.studentsNeeded} คน</p>
              </div>

              {currentRole === 'ADVISOR' && (
                <div>
                  <strong className="info-label"><Briefcase size={16}/> ค่าตอบแทน:</strong>
                  <p className="info-value" style={{ color: '#16a34a', fontWeight: 'bold' }}>{project.allowance}</p>
                </div>
              )}
            </div>

            <div>
              <strong className="info-label">ลักษณะงาน (Job Description):</strong>
              <p className="info-value" style={{ whiteSpace: 'pre-line' }}>{project.jobDescription}</p>
            </div>
            <div>
              <strong className="info-label"><Wrench size={16}/> เครื่องมือและทักษะที่ต้องใช้:</strong>
              <p className="info-value">{project.skills}</p>
            </div>
            <div>
              <strong className="info-label"><MapPin size={16}/> สถานที่ปฏิบัติงาน:</strong>
              <p className="info-value">{project.workLocation}</p>
            </div>
          </div>
        </div>

        {/* ข้อมูลผู้จัดการโครงการ / พี่เลี้ยง */}
        <div className="detail-section">
          <h3><UserCheck size={20} color="#f59e0b" /> ข้อมูลผู้จัดการโครงการ</h3>
          <div className="mentor-grid">
            <div>
              <strong className="info-label">ชื่อ-นามสกุล:</strong>
              <div className="info-value" style={{ fontWeight: 500 }}>{project.mentorName}</div>
            </div>
            <div>
              <strong className="info-label">ตำแหน่ง:</strong>
              <div className="info-value">{project.mentorPosition}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong className="info-label">แผนก:</strong>
              <div className="info-value">{project.mentorDepartment}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="#64748b"/> <span>{project.mentorPhone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#64748b"/> <span>{project.mentorEmail}</span>
            </div>
          </div>
        </div>

        {/* ข้อมูลอาจารย์ที่ปรึกษา */}
        <div className="detail-section">
          <h3><GraduationCap size={20} color="#8b5cf6" /> อาจารย์ผู้ดูแลโครงการ</h3>
          <div className="info-box-purple">
            <div>
              <strong className="info-label">ชื่ออาจารย์:</strong>
              <div className="info-value" style={{ fontWeight: 500 }}>{project.advisorName || 'ยังไม่มีอาจารย์ที่ปรึกษา'}</div>
            </div>
            <div>
              <strong className="info-label">อีเมล:</strong>
              <div className="info-value">{project.advisorEmail || '-'}</div>
            </div>
          </div>
        </div>

        {/* 🔒 แสดงเอกสารแนบ เฉพาะฝั่ง ADVISOR เท่านั้น */}
        {currentRole === 'ADVISOR' && (
          <div className="detail-section">
            <h3><Paperclip size={20} color="#64748b" /> เอกสารแนบ</h3>
            <div className="attachment-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
                <FileText size={20} color="#ef4444"/>
                <span>{project.attachments}</span>
              </div>
              <button className="btn-download">ดาวน์โหลด</button>
            </div>
          </div>
        )}

        {/* ปุ่ม Action (เปลี่ยนตาม Role) */}
        <div className="action-buttons">
          <button className="btn-close" onClick={() => navigate(-1)}>ปิด</button>
          
          {currentRole === 'ADVISOR' && (
            <button className="btn-approve" onClick={handleApprove}>
              <CheckCircle size={18} /> อนุมัติโครงการและรับดูแล
            </button>
          )}

          {currentRole === 'STUDENT' && (
            <button className="btn-apply-main" onClick={handleApplyClick}>
              <Briefcase size={18} /> สมัครโครงการนี้
            </button>
          )}
        </div>

      </div>
    </div>
  );
}