import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  Info,
  Building2,
  Calendar,
  ChevronRight
} from 'lucide-react';
import './Advisor.css';

export default function AvailableProjects() {
  const navigate = useNavigate();
  const [pendingProjects] = useState([
    {
      id: 1,
      title: 'AI Chatbot for Customer Service',
      company: 'Tech Innovate Co., Ltd.',
      date: '25 มี.ค. 2569',
      studentsNeeded: 2
    },
    {
      id: 2,
      title: 'Mobile Banking App Redesign',
      company: 'Finance Plus',
      date: '24 มี.ค. 2569',
      studentsNeeded: 1
    },
  ]);

  return (
    <div className="advisor-page">
      <div className="page-header-section">
        <h2 className="page-title">โครงการที่รอการอนุมัติ</h2>
        <p className="page-subtitle">ตรวจสอบรายละเอียดโครงการและเลือกรับเป็นอาจารย์ที่ปรึกษา</p>
      </div>

      <div className="advisor-card">
        <div className="table-actions">
          <div className="search-wrapper">
            <Search size={18} />
            <input type="text" placeholder="ค้นหาชื่อโครงการ หรือ บริษัท..." />
          </div>
        </div>

        <table className="advisor-table">
          <thead>
            <tr>
              <th>ชื่อโครงการ / ตำแหน่งงาน</th>
              <th>บริษัท</th>
              <th>วันที่ส่ง</th>
              <th>จำนวนที่รับ</th>
              <th style={{ textAlign: 'center' }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {pendingProjects.map((proj) => (
              <tr key={proj.id}>
                <td className="proj-title-cell">
                  <div className="title-text">{proj.title}</div>
                  {/* แก้ไขตรงนี้: รวมปุ่มให้เหลืออันเดียว และใส่ onClick พร้อมข้อความ */}
                  <button
                    className="btn-view-detail"
                    onClick={() => navigate(`/advisor/projects/${proj.id}`)}
                  >
                    ดูรายละเอียด <ChevronRight size={14} />
                  </button>
                </td>
                <td>
                  <div className="company-info-cell">
                    <Building2 size={16} /> {proj.company}
                  </div>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={16} /> {proj.date}
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--company-orange)' }}>
                  {proj.studentsNeeded} คน
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-approve-claim">
                    <CheckCircle size={18} /> อนุมัติและรับดูแล
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="helper-note">
        <Info size={16} />
        <span>เมื่อกด <strong>"อนุมัติและรับดูแล"</strong> โครงการจะถูกเปลี่ยนสถานะเป็น APPROVED และคุณจะกลายเป็นอาจารย์ที่ปรึกษาทันที</span>
      </div>
    </div>
  );
}