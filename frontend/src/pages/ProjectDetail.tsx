import React, { useState, useEffect } from 'react'; // 👈 เพิ่ม useEffect
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // 👈 เพิ่ม useParams
import { 
  ArrowLeft, Building2, MapPin, Users, Wrench, 
  UserCheck, Phone, Mail, FileText, CheckCircle, 
  Briefcase, GraduationCap, Paperclip, UserCircle, 
  Contact, Loader2 
} from 'lucide-react';
import './students/Projects.css';
import { projectService } from '../api/services/projectService'; // 👈 นำเข้า Service

export default function ProjectDetail() {
  const { id } = useParams(); // 👈 ดึง ID จาก URL
  const location = useLocation();
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [project, setProject] = useState<any>(null); // 👈 เปลี่ยนจาก Mock เป็น State ว่าง
  const [loading, setLoading] = useState(true);

  // --- 1. โหลดข้อมูลจาก Backend เมื่อเข้าหน้าจอ ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const res = await projectService.getOne(id);
          setProject(res.data);
        }
      } catch (err) {
        console.error("Error fetching project detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  let currentRole = '';
  if (location.pathname.includes('/student')) {
    currentRole = 'STUDENT';
  } else if (location.pathname.includes('/advisor')) {
    currentRole = 'ADVISOR';
  }

  // --- Logic การสมัคร (เหมือนเดิม แต่ใช้ชื่อ Field จาก DB) ---
  const handleApplyClick = () => {
    const savedApps = JSON.parse(localStorage.getItem('myApplications') || '[]');
    if (savedApps.length >= 2) {
      alert('คุณสามารถสมัครโครงการได้สูงสุด 2 รายการเท่านั้น');
      return;
    }
    const isAlreadyApplied = savedApps.some((app: any) => app.title === project.projNameTH);
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
      title: project.projNameTH,
      company: project.company?.coNameTH,
      status: "PENDING",
      date: new Date().toLocaleDateString('th-TH')
    };
    localStorage.setItem('myApplications', JSON.stringify([...savedApps, newApplication]));
    setIsConfirmOpen(false); 
    navigate('/student/applications'); 
  };

  // --- แสดง Loading ระหว่างรอข้อมูล ---
  if (loading) return <div className="loading-screen"><Loader2 className="animate-spin" /> กำลังโหลดรายละเอียด...</div>;
  if (!project) return <div className="error-screen">ไม่พบข้อมูลโครงการ</div>;

  return (
    <div className="project-detail-container text-left">
      
      {/* Modal ยืนยันการสมัคร (เหมือนเดิม) */}
      {isConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon-wrapper">
              <Briefcase size={32} color="#f97316" />
            </div>
            <h3>ยืนยันการสมัครโครงการ</h3>
            <p>
              ต้องการส่งใบสมัครเข้าโครงการ <br/>
              <strong style={{ color: '#0f172a' }}>{project.projNameTH}</strong> <br/>
              ของ <strong>{project.company?.coNameTH}</strong> ใช่หรือไม่?
            </p>
            <div className="modal-actions">
              <button className="btn-outline-cancel" onClick={() => setIsConfirmOpen(false)}>ยกเลิก</button>
              <button className="btn-confirm-apply" onClick={confirmApply}>ยืนยันการสมัคร</button>
            </div>
          </div>
        </div>
      )}

      <button className="btn-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> กลับ
      </button>

      <div className="detail-card">
        
        {/* ส่วนหัวโครงการ */}
        <div className="detail-header-section">
          <h1>{project.projNameTH}</h1>
          <p className="text-gray-500">{project.projNameEN}</p>
          <div className="company-badge">
            <Building2 size={20} color="#f97316" />
            <strong>{project.company?.coNameTH}</strong>
          </div>
        </div>

        {/* 1. รายละเอียดโครงการ (Mapping ใหม่) */}
        <div className="detail-section">
          <h3><FileText size={20} color="#3b82f6" /> รายละเอียดโครงการ</h3>
          <div className="info-box">
            <div>
              <strong className="info-label">วัตถุประสงค์ / รายละเอียด:</strong>
              <p className="info-value">{project.projDetail || 'ไม่มีข้อมูลรายละเอียด'}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              <div>
                <strong className="info-label"><Users size={16}/> จำนวนที่รับ:</strong>
                <p className="info-value">{project.projAmount} คน</p>
              </div>
              <div>
                <strong className="info-label"><Briefcase size={16}/> สถานะ:</strong>
                <p className="info-value" style={{ color: '#f97316' }}>{project.projStat}</p>
              </div>
            </div>

            <div>
              <strong className="info-label"><MapPin size={16}/> สถานที่ปฏิบัติงาน:</strong>
              <p className="info-value">{project.company?.coAddr}</p>
            </div>
          </div>
        </div>

        {/* 2. ข้อมูลผู้จัดการโครงการ (Mapping จาก projectManager) */}
        <div className="detail-section">
          <h3><UserCircle size={20} color="#8b5cf6" /> ข้อมูลผู้จัดการโครงการ (PM)</h3>
          <div className="mentor-grid info-box">
            <div>
              <strong className="info-label">ชื่อ-นามสกุล:</strong>
              <div className="info-value" style={{ fontWeight: 500 }}>{project.projectManager?.pmName || 'ไม่ระบุ'}</div>
            </div>
            <div>
              <strong className="info-label">ตำแหน่ง:</strong>
              <div className="info-value">{project.projectManager?.pmPos || '-'}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong className="info-label">แผนก/ฝ่าย:</strong>
              <div className="info-value">{project.projectManager?.pmDept || '-'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="#64748b"/> <span>{project.projectManager?.pmTel || '-'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#64748b"/> <span>{project.projectManager?.pmEmail || '-'}</span>
            </div>
          </div>
        </div>

        {/* 3. ข้อมูลฝ่ายบุคคล (Mapping จาก hr) */}
        <div className="detail-section">
          <h3><Contact size={20} color="#10b981" /> ข้อมูลผู้ติดต่อประสานงาน (HR)</h3>
          <div className="mentor-grid info-box" style={{ borderLeft: '4px solid #10b981' }}>
            <div>
              <strong className="info-label">ชื่อ-นามสกุล:</strong>
              <div className="info-value" style={{ fontWeight: 500 }}>{project.hr?.hrName || 'ไม่ระบุ'}</div>
            </div>
            <div>
              <strong className="info-label">ตำแหน่ง:</strong>
              <div className="info-value">{project.hr?.hrPosition || '-'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="#64748b"/> <span>{project.hr?.hrTel || '-'}</span>
            </div>
          </div>
        </div>

        {/* 4. อาจารย์ผู้ดูแลโครงการ (Mapping จาก advisor) */}
        <div className="detail-section">
          <h3><GraduationCap size={20} color="#8b5cf6" /> อาจารย์ที่ปรึกษาโครงการ</h3>
          <div className="info-box-purple">
            <div>
              <strong className="info-label">ชื่ออาจารย์:</strong>
              <div className="info-value" style={{ fontWeight: 500 }}>{project.advisor?.advName || 'ยังไม่มีอาจารย์ที่ปรึกษา'}</div>
            </div>
          </div>
        </div>

        {/* ปุ่มดำเนินการ (เหมือนเดิม) */}
        <div className="action-buttons">
          <button className="btn-close" onClick={() => navigate(-1)}>ปิด</button>
          
          {currentRole === 'ADVISOR' && (
            <button className="btn-approve" onClick={() => alert('อนุมัติสำเร็จ (กำลังพัฒนาเชื่อม API)')}>
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