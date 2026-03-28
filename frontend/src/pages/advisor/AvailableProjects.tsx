import React, { useState } from 'react';
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

  const [approveConfirm, setApproveConfirm] = useState({
    isOpen: false,
   projectId: null as number | null,
    projectTitle: '',
    company: ''
  });

  const [pendingProjects, setPendingProjects] = useState([
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

  const confirmApprove = () => {
    const updatedProjects = pendingProjects.filter(p => p.id !== approveConfirm.projectId);
    setPendingProjects(updatedProjects);
    setApproveConfirm({ isOpen: false, projectId: null, projectTitle: '', company: '' });
    
  };

  return (
    <div className="advisor-page">
      
      {approveConfirm.isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '20px', width: '420px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            <div style={{ background: '#dcfce7', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={32} color="#16a34a" />
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#0f172a' }}>ยืนยันการรับดูแลโครงการ</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
              ต้องการอนุมัติและรับเป็นที่ปรึกษาโครงการ <br/>
              <strong style={{ color: '#0f172a' }}>{approveConfirm.projectTitle}</strong> <br/>
              ของ <strong>{approveConfirm.company}</strong> ใช่หรือไม่?
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setApproveConfirm({ ...approveConfirm, isOpen: false })} 
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, cursor: 'pointer', color: '#475569' }}
              >
                ยกเลิก
              </button>
              <button 
                onClick={confirmApprove} 
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#16a34a', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                ยืนยันอนุมัติ
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <button 
                    className="btn-view-detail"
                    onClick={() => navigate(`/advisor/projects/${proj.id}`)}
                  >
                    ดูรายละเอียด <ChevronRight size={14}/>
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
                  <button 
                    className="btn-approve-claim"
                    onClick={() => setApproveConfirm({ 
                      isOpen: true, 
                      projectId: proj.id, 
                      projectTitle: proj.title,
                      company: proj.company
                    })}
                  >
                    <CheckCircle size={18} /> อนุมัติและรับดูแล
                  </button>
                </td>
              </tr>
            ))}
            {pendingProjects.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  ไม่มีโครงการที่รอการอนุมัติในขณะนี้
                </td>
              </tr>
            )}
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