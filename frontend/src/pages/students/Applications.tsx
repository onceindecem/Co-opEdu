import { useState } from 'react';
import './Applications.css';
import { Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';

const INITIAL_APPS = [
  { id: 1, title: "Web Developer", company: "ABC Tech", status: "PENDING", date: "20/03/2026" },
  { id: 2, title: "UX/UI Designer", company: "Creative Studio", status: "APPROVED", date: "22/03/2026" },
];

export default function StudentApplications() {
  const [applications, setApplications] = useState(INITIAL_APPS);

  const handleDelete = (id: number) => {
    if (window.confirm("คุณต้องการยกเลิกการสมัครโครงการนี้ใช่หรือไม่?")) {
      setApplications(applications.filter(app => app.id !== id));
    }
  };

  return (
    <div className="apps-container">
      <div className="apps-header">
        <h1>การสมัครของฉัน</h1>
        <p>คุณสามารถสมัครโครงการได้สูงสุด 2 รายการ ({applications.length}/2)</p>
      </div>

      <div className="apps-list">
       {applications.map((app) => (
  <div key={app.id} className="app-item-card">
    {/* 1. ข้อมูลฝั่งซ้าย */}
    <div className="app-info">
      <h3>{app.title}</h3>
      <p style={{ color: 'var(--orange-kmitl)', fontWeight: 600 }}>{app.company}</p>
      <span className="app-date">สมัครเมื่อ: {app.date}</span>
    </div>
    
    {/* 2. สถานะฝั่งขวา */}
    <div className="app-status-zone">
      {app.status === "PENDING" && (
        <span className="status-tag pending"><Clock size={16}/> รอยืนยัน</span>
      )}
      {app.status === "APPROVED" && (
        <span className="status-tag approved"><CheckCircle size={16}/> ผ่านการคัดเลือก</span>
      )}
      {app.status === "REJECTED" && (
        <span className="status-tag rejected"><XCircle size={16}/> ไม่ผ่าน</span>
      )}
    </div>

    {/* 3. ปุ่มถังขยะ (ย้ายมาวางตรงนี้เพื่อให้ position: absolute ทำงานได้ถูกต้อง) */}
    {app.status !== "APPROVED" && (
      <button 
        className="btn-delete" 
        onClick={() => handleDelete(app.id)}
      >
        <Trash2 size={18} />
      </button>
    )}
  </div>
))}

        {applications.length === 0 && (
          <div className="empty-state">
            <p>ยังไม่มีรายการสมัครโครงการ</p>
            <a href="/student/projects" className="btn-go-find">ไปหาโครงการฝึกงาน</a>
          </div>
        )}
      </div>
    </div>
  );
}