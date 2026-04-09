import { useState, useEffect, useCallback } from 'react';
import { 
  Users, CheckCircle2, XCircle, Search, ArrowLeft, Mail, GraduationCap, Loader2 
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import './Advisor.css';
import { applicationService } from '../../api/services/applicationService'; 
import { projectService } from '../../api/services/projectService';

export default function ManageStudents() {
  const { projectId } = useParams(); 

  const [applications, setApplications] = useState<any[]>([]);
  const [projectDetail, setProjectDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    if (!projectId) return;
    try {
      const appRes = await applicationService.getApplicationsByProject(projectId);
      setApplications(appRes.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  }, [projectId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const projRes = await projectService.getById(projectId);
        setProjectDetail(projRes.data);
        await fetchApplications();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [projectId, fetchApplications]);

  // approve
  const handleApprove = async (appId: string) => {
    if (!window.confirm("ต้องการ 'ยืนยัน' การสมัครของนักศึกษาคนนี้ใช่หรือไม่?")) return;
    try {
      await applicationService.updateAppStat(appId, 'APPROVED');
      fetchApplications();
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };


  // reject
  const handleReject = async (appId: string) => {
    if (!window.confirm("ต้องการ 'ปฏิเสธ' การสมัครของนักศึกษาคนนี้ใช่หรือไม่?")) return;
    try {
      await applicationService.updateAppStat(appId, 'DENIED');
      fetchApplications(); 
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการปฏิเสธ");
    }
  };


  // update hire stat
  const handleHiredChange = async (appId: string, newHiredStat: string) => {
    try {
      await applicationService.updateHiredStat(appId, newHiredStat);
      fetchApplications();
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการอัปเดตผลการจ้างงาน");
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><Loader2 className="animate-spin" /> กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="advisor-page">
      <div className="page-header-flex">
        <div className="header-left">
          <Link to="/advisor/projects/mine" className="btn-back-link">
            <ArrowLeft size={18} /> กลับไปหน้าโครงการ
          </Link>
          <h2 className="title-with-icon">
            <Users size={28} /> จัดการรายชื่อนักศึกษา
          </h2>
          <p className="subtitle">โครงการ: {projectDetail?.projName || 'ไม่ระบุชื่อโครงการ'}</p>
        </div>
        <div className="header-right">
          <div className="project-cap-badge">
             <GraduationCap size={18} /> นักศึกษาที่สมัคร: {applications.length} คน
          </div>
        </div>
      </div>

      <div className="advisor-card">
        <div className="table-filter-bar" style={{ marginBottom: '20px' }}>
          <div className="search-wrapper">
            <Search size={18} />
            <input type="text" placeholder="ค้นหารหัสนักศึกษา หรือ ชื่อ..." />
          </div>
        </div>

        <table className="advisor-table">
          <thead>
            <tr>
              <th>ข้อมูลนักศึกษา</th>
              <th>สถานะการสมัคร</th>
              <th>ผลการจ้างงาน (Final)</th>
              <th style={{ textAlign: 'center' }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const userAccount = app.user || {}; 
              const studentProfile = userAccount.student || {}; 
              const studentName = `${studentProfile.firstName || ''} ${studentProfile.lastName || ''}`.trim() || 'ไม่ระบุชื่อ';

              return (
                <tr key={app.appID}>
                  <td>
                    <div className="student-info-cell">
                      <div className="std-avatar">{studentName.charAt(0) || 'U'}</div>
                      <div className="std-details">
                        <span className="std-name">{studentName}</span>
                        <span className="std-id">ID: {studentProfile.studentID || '-'}</span> 
                        <span className="std-contact"><Mail size={12}/> {userAccount.email || '-'}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${app.appStat?.toLowerCase() || 'pending'}`}>
                      {app.appStat === 'APPROVED' ? '🟢 ยืนยันสิทธิแล้ว' : 
                       app.appStat === 'DENIED' ? '🔴 ปฏิเสธ' : '🟡 รอยืนยัน'}
                    </span>
                  </td>
                  <td>
                    <select 
                      className={`hired-select ${app.hiredStat?.toLowerCase() || 'WAITING'}`}
                      value={app.hiredStat || 'WAITING'}
                      disabled={app.appStat !== 'APPROVED'}
                      onChange={(e) => handleHiredChange(app.appID, e.target.value)}
                    >
                      <option value="WAITING">⌛ รอสรุปผล</option>
                      <option value="HIRED">✅ HIRED (ได้งาน)</option>
                      <option value="NOT_HIRED">❌ NOT HIRED</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-group">
                      {app.appStat === 'PENDING' ? (
                        <>
                          <button 
                            className="btn-action-confirm" 
                            title="อนุมัติ"
                            onClick={() => handleApprove(app.appID)}
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <button 
                            className="btn-action-reject" 
                            title="ปฏิเสธ"
                            onClick={() => handleReject(app.appID)}
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      ) : (
                        <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>-</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {applications.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '30px' }}>
                  ยังไม่มีนักศึกษาสมัครในโครงการนี้
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}