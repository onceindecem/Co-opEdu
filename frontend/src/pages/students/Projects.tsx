import './Projects.css';
import { Search, MapPin, Briefcase } from 'lucide-react';

export default function StudentProjects() {
  return (
    <div className="projects-container">
      <div className="search-section">
        <h1>ค้นหาโอกาสที่ใช่สำหรับคุณ</h1>
        <div className="search-bar">
          <input type="text" placeholder="ค้นหาชื่อโครงการ หรือชื่อบริษัท..." />
          <button className="btn-search">ค้นหา</button>
        </div>
      </div>

      <div className="project-grid">
        <div className="project-card">
          <div className="status-badge">Approved</div>
          <h3>TTB tech & data Internship 2026</h3>
          <p className='position'>UX/UI</p>
          <p className="company">บริษัท เอบีซี จำกัด</p>
          <div className="info-row">
            <MapPin size={16} /> <span>กรุงเทพมหานคร</span>
          </div>
          <div className="info-row">
            <Briefcase size={16} /> <span>2 คน</span>
          </div>
          <button className="btn-view" onClick={() => window.location.href='/student/projects/1'}>
            ดูรายละเอียดและสมัคร
          </button>
        </div>
      </div>
    </div>
  );
}