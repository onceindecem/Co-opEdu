import { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ArrowLeft,
  Mail,
  GraduationCap
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import './Advisor.css';

export default function ManageStudents() {
  const { projectId } = useParams(); 

  const [students] = useState([
    { 
      id: 1, 
      name: 'นายสมชาย วิทยา', 
      studentId: '66050001', 
      email: '66050001@kmitl.ac.th',
      status: 'PENDING_CONFIRM', 
      hiredStatus: 'WAITING' 
    },
    { 
      id: 2, 
      name: 'นางสาววิภาดา เรียนดี', 
      studentId: '66050015', 
      email: '66050015@kmitl.ac.th',
      status: 'CONFIRMED', 
      hiredStatus: 'WAITING' 
    },
    { 
      id: 3, 
      name: 'นายมานะ อดทน', 
      studentId: '66050099', 
      email: '66050099@kmitl.ac.th',
      status: 'CONFIRMED', 
      hiredStatus: 'HIRED'
    },
  ]);

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
          <p className="subtitle">โครงการ: Web Application for Inventory Management (ID: {projectId})</p>
        </div>
        <div className="header-right">
          <div className="project-cap-badge">
             <GraduationCap size={18} /> นักศึกษาที่สมัคร: {students.length} คน
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
              <th>สถานะสิทธิ</th>
              <th>ผลการจ้างงาน (Final)</th>
              <th style={{ textAlign: 'center' }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {students.map((std) => (
              <tr key={std.id}>
                <td>
                  <div className="student-info-cell">
                    <div className="std-avatar">{std.name[0]}</div>
                    <div className="std-details">
                      <span className="std-name">{std.name}</span>
                      <span className="std-id">ID: {std.studentId}</span>
                      <span className="std-contact"><Mail size={12}/> {std.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-pill ${std.status.toLowerCase()}`}>
                    {std.status === 'CONFIRMED' ? '🟢 ยืนยันสิทธิแล้ว' : '🟡 รอการยืนยัน'}
                  </span>
                </td>
                <td>
                  <select 
                    className={`hired-select ${std.hiredStatus.toLowerCase()}`}
                    defaultValue={std.hiredStatus}
                    disabled={std.status !== 'CONFIRMED'}
                  >
                    <option value="WAITING">⌛ รอสรุปผล</option>
                    <option value="HIRED">✅ HIRED (ได้งาน)</option>
                    <option value="NOT_HIRED">❌ NOT HIRED</option>
                  </select>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div className="action-group">
                    {std.status === 'PENDING_CONFIRM' ? (
                      <>
                        <button className="btn-action-confirm" title="ยืนยันสิทธิ">
                          <CheckCircle2 size={20} />
                        </button>
                        <button className="btn-action-reject" title="ปฏิเสธสิทธิ">
                          <XCircle size={20} />
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>-</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}