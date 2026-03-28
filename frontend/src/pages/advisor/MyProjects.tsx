import { useState } from 'react';
import { 
  FolderCheck, 
  Users, 
  ArrowRight, 
  Building2, 
  ClipboardCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Advisor.css';

export default function MyProjects() {
  const [myProjects] = useState([
    { 
      id: 101, 
      title: 'Web Application for Inventory Management', 
      company: 'ABC Tech Solutions', 
      appliedCount: 3, 
      status: 'OPEN' 
    },
    { 
      id: 102, 
      title: 'Data Analysis Dashboard', 
      company: 'Global Data Co.', 
      appliedCount: 5, 
      status: 'CLOSED'
    }
  ]);

  return (
    <div className="advisor-page">
      <div className="page-header-section">
        <h2 className="page-title">โครงการในความดูแล</h2>
        <p className="page-subtitle">จัดการและติดตามสถานะนักศึกษาในโครงการที่คุณเป็นที่ปรึกษา</p>
      </div>

      <div className="project-grid">
        {myProjects.map((proj) => (
          <div key={proj.id} className="advisor-card project-item-card">
            <div className="card-top">
              <span className={`status-tag ${proj.status.toLowerCase()}`}>
                {proj.status === 'OPEN' ? '🟢 เปิดรับสมัคร' : '🔴 ปิดรับสมัคร'}
              </span>
              <div className="company-tag">
                <Building2 size={14} /> {proj.company}
              </div>
            </div>

            <h3 className="project-card-title">{proj.title}</h3>

            <div className="card-stats">
              <div className="stat-box">
                <span className="stat-label">นักศึกษาที่สมัคร</span>
                <span className="stat-value">
                  <Users size={18} /> {proj.appliedCount} คน
                </span>
              </div>
              <div className="stat-box">
                <span className="stat-label">รายงานความคืบหน้า</span>
                <span className="stat-value">
                  <ClipboardCheck size={18} /> 08 / 12
                </span>
              </div>
            </div>

            <div className="card-actions">
              <Link to={`/advisor/projects/${proj.id}/students`} className="btn-manage-students">
                จัดการรายชื่อนักศึกษา <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {myProjects.length === 0 && (
        <div className="empty-state">
          <FolderCheck size={48} color="#cbd5e1" />
          <p>คุณยังไม่มีโครงการในความดูแล เริ่มต้นโดยการอนุมัติโครงการใหม่</p>
          <Link to="/advisor/projects/available" className="btn-primary">ไปหน้าอนุมัติโครงการ</Link>
        </div>
      )}
    </div>
  );
}