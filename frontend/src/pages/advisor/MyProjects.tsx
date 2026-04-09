import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  ArrowRight,
  FolderCheck,
  UserCheck
} from 'lucide-react';
import { projectService } from '../../api/services/projectService';
import './Advisor.css';

export default function MyProjects() {
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          กำลังโหลดโครงการของคุณ...
        </div>
      ) : (
        <>
          <div className="project-grid">
            {myProjects.map((proj) => {
              const roundNumber = String(proj.round || '1');
              const isRound1 = roundNumber === '1';
              const totalApplicants = proj.applications ? proj.applications.length : 0;
              const processedCount = proj.applications
                ? proj.applications.filter((app: any) =>
                  app.appStat === 'APPROVED' ||
                  app.appStat === 'DENIED'
                ).length
                : 0;

              return (
                <div key={proj.id || proj.projID} className="advisor-card project-item-card">
                  <div className="card-top">
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
                        <Users size={18} /> {totalApplicants} คน
                      </span>
                    </div>

                    <div className="stat-box">
                      <span className="stat-label">พิจารณาแล้ว</span>
                      <span className="stat-value">
                        <UserCheck size={18} /> {processedCount} / {totalApplicants} คน
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