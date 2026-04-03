import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ClipboardCheck,
  Building2,
  ArrowRight,
  FolderCheck
} from 'lucide-react';
import { projectService } from '../../api/services/projectService'; // 🌟 นำเข้า API Service
import './Advisor.css';

export default function MyProjects() {
  // 🌟 เปลี่ยน State เป็น Array ว่างเพื่อรอรับข้อมูลจาก API และเพิ่ม Loading
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌟 ใช้ useEffect เพื่อดึงข้อมูลตอนเปิดหน้านี้ขึ้นมา
  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      // สมมติว่าใน projectService มี API ดึงโครงการเฉพาะของอาจารย์ที่ล็อกอินอยู่
      const res = await projectService.getMyAdvisorProjects();
      setMyProjects(res.data || []);
    } catch (error) {
      console.error("ดึงข้อมูลโครงการไม่สำเร็จ:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advisor-page">
      <div className="page-header-section">
        <h2 className="page-title">โครงการในความดูแล</h2>
        <p className="page-subtitle">จัดการและติดตามสถานะนักศึกษาในโครงการที่คุณเป็นที่ปรึกษา</p>
      </div>

      {/* 🌟 แสดงข้อความระหว่างรอโหลดข้อมูล */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          กำลังโหลดโครงการของคุณ...
        </div>
      ) : (
        <>
          <div className="project-grid">
            {myProjects.map((proj) => {
              // ดึงค่า status หรือ round จาก Backend มาเช็ค (เผื่อฟิลด์ชื่อไม่ตรงกัน)
              const roundNumber = String(proj.round || '1');
              const isRound1 = roundNumber === '1';
              const appCount = proj.applications ? proj.applications.length : 0;

              return (
                <div key={proj.id || proj.projID} className="advisor-card project-item-card">
                  <div className="card-top">
                    {/* 🌟 2. เอามาแสดงผลตามค่ารอบที่ดึงมาได้จริง */}
                    <span className={`status-tag ${isRound1 ? 'open' : 'closed'}`}>
                      {isRound1 ? '🟢 รอบที่ 1' : `🔴 รอบที่ ${roundNumber}`}
                    </span>
                    <div className="company-tag">
                      <Building2 size={14} /> {proj.company?.coNameTH || proj.companyName || 'ไม่ระบุชื่อบริษัท'}
                    </div>
                  </div>

                  <h3 className="project-card-title">{proj.title || proj.projNameTH || proj.projName || 'ไม่ระบุชื่อโครงการ'}</h3>

                  <div className="card-stats">
                    <div className="stat-box">
                      <span className="stat-label">นักศึกษาที่สมัคร</span>
                      <span className="stat-value">
                        {/* สมมติ Backend ส่งจำนวนนักศึกษามาในชื่อ studentCount หรือ appliedCount */}
                        <Users size={18} /> {appCount} คน
                      </span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">รายงานความคืบหน้า</span>
                      <span className="stat-value">
                        {/* สมมติ Backend ส่งจำนวนรายงานมา */}
                        <ClipboardCheck size={18} /> {proj.reportCount || '08'} / 12
                      </span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <Link to={`/advisor/projects/${proj.id || proj.projID}/students`} className="btn-manage-students">
                      จัดการรายชื่อนักศึกษา <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 🌟 ซ่อน Empty State ถ่ายังโหลดไม่เสร็จ หรือถ้ามีข้อมูลแล้ว */}
          {myProjects.length === 0 && (
            <div className="empty-state">
              <FolderCheck size={48} className="empty-icon" />
              <p>คุณยังไม่มีโครงการในความดูแล เริ่มต้นโดยการอนุมัติโครงการใหม่</p>
              <Link to="/advisor/projects/available" className="btn-primary">ไปหน้าอนุมัติโครงการ</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}