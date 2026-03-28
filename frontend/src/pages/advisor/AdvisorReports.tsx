import React, { useState } from 'react';
import { Building2, Activity, Clock, Eye, X, FileText } from 'lucide-react';

export default function AdvisorReports() {
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const reportData = [
    {
      id: 1,
      project: "AI Chatbot for Customer Service",
      company: "TechNova Co.",
      position: "Frontend Developer",
      student: "นายสมชาย ใจดี",
      studentId: "66050001",
      currentStatus: "นัดวันสัมภาษณ์แล้ว", 
      interviewDate: "25/04/2026",
      lastUpdate: "24/03/2026",
      reportTitle: "ส่ง Portfolio และได้รับการติดต่อกลับ",
      reportDetail: "ทาง HR ของ TechNova ติดต่อมาเพื่อนัดวันสัมภาษณ์ทางออนไลน์ผ่าน Google Meet ครับ ผมได้เตรียมตัวและส่งเอกสารเพิ่มเติมไปให้แล้ว",
    },
    {
      id: 2,
      project: "Inventory Management System",
      company: "Global Logistics",
      position: "Backend Developer",
      student: "นางสาววิภาดา เรียนดี",
      studentId: "66050015",
      currentStatus: "ส่งอีเมลแล้วรอการตอบกลับ", 
      interviewDate: "",
      lastUpdate: "20/03/2026",
      reportTitle: "ส่ง Resume ไปยังอีเมลบริษัท",
      reportDetail: "หนูได้ทำการแนบ Resume และ Transcript ส่งไปยังอีเมล hr@globallogistics.com เรียบร้อยแล้วค่ะ ตอนนี้กำลังรอการตอบกลับเพื่อทำแบบทดสอบ",
    },
    {
      id: 3,
      project: "Data Analytics Dashboard",
      company: "DataCorp",
      position: "Data Analyst",
      student: "นายมานะ อดทน",
      studentId: "66050099",
      currentStatus: "ผ่านการสัมภาษณ์", 
      interviewDate: "",
      lastUpdate: "22/03/2026",
      reportTitle: "ผลการสัมภาษณ์รอบสุดท้าย",
      reportDetail: "พี่ๆ ในทีม Data แจ้งว่าผ่านการสัมภาษณ์แล้วครับ จะเริ่มงานในวันที่ 1 พฤษภาคมนี้ โดยจะมีการปฐมนิเทศก่อนเริ่มงาน 1 วันครับ",
    }
  ];

  const getStatusStyle = (status: string) => {
    if (status === 'ผ่านการสัมภาษณ์') {
      return { border: '1px solid #22c55e', backgroundColor: '#f0fdf4', color: '#15803d' };
    }
    if (status === 'ไม่ผ่านการสัมภาษณ์') {
      return { border: '1px solid #ef4444', backgroundColor: '#fef2f2', color: '#b91c1c' };
    }
    return { border: '1px solid #f97316', backgroundColor: '#fff7ed', color: '#ea580c' }; 
  };

  const handleOpenModal = (item: any) => {
    setSelectedReport(item);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="advisor-page">
      <div className="page-header-section">
        <h2 className="page-title">ติดตามสถานะการสมัครงาน</h2>
        <p className="page-subtitle">ตรวจสอบความคืบหน้าล่าสุดและรายละเอียดบันทึกของนักศึกษา</p>
      </div>

      <div className="advisor-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="advisor-table">
            <thead>
              <tr>
                <th>โครงการ / บริษัท</th>
                <th>ชื่อนักศึกษา</th>
                <th style={{ minWidth: '220px' }}><Activity size={16} style={{ position: 'relative', top: '2px', marginRight: '4px' }}/> สถานะปัจจุบัน</th>
                <th><Clock size={16} style={{ position: 'relative', top: '2px', marginRight: '4px' }}/> อัปเดตล่าสุด</th>
                <th style={{ textAlign: 'center' }}>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="project-info-mini">
                      <div className="title-text" style={{ fontSize: '0.95rem' }}>{item.project}</div>
                      <div className="pos" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
                        <Building2 size={12} /> {item.company} • {item.position}
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="std-info-small">
                      <div style={{ fontWeight: '500', color: '#1e293b' }}>{item.student}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>ID: {item.studentId}</div>
                    </div>
                  </td>

                  <td>
                    <span style={{
                      ...getStatusStyle(item.currentStatus),
                      display: 'inline-block',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      {item.currentStatus === 'นัดวันสัมภาษณ์แล้ว' && item.interviewDate
                        ? `${item.currentStatus} (${item.interviewDate})`
                        : item.currentStatus}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      {item.lastUpdate}
                    </span>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => handleOpenModal(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#3b82f6',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        margin: '0 auto',
                        fontWeight: '500',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Eye size={18} /> ดูบันทึก
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReport && (
        <div className="modal-overlay" style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', zIndex: 1000 
        }}>
          <div className="modal-content" style={{ 
            backgroundColor: 'white', borderRadius: '12px', padding: '24px', 
            width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={20} color="#3b82f6" /> รายละเอียดบันทึก
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  อัปเดตเมื่อ: {selectedReport.lastUpdate}
                </p>
              </div>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#334155', fontSize: '0.95rem' }}>หัวข้อบันทึก</h4>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#1e293b' }}>
                {selectedReport.reportTitle}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#334155', fontSize: '0.95rem' }}>รายละเอียด</h4>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569', minHeight: '80px', lineHeight: '1.6' }}>
                {selectedReport.reportDetail}
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#334155', fontSize: '0.95rem' }}>สถานะในขณะนั้น</h4>
              <span style={{
                ...getStatusStyle(selectedReport.currentStatus),
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                {selectedReport.currentStatus === 'นัดวันสัมภาษณ์แล้ว' && selectedReport.interviewDate
                  ? `${selectedReport.currentStatus} (${selectedReport.interviewDate})`
                  : selectedReport.currentStatus}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}