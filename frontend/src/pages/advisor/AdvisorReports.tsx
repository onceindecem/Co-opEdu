import React, { useState } from 'react';
import {
  Building2, Activity, Clock, Eye, X, FileText,
  UserCheck, Users, Mail, ClipboardList, UserX,
  Send, Hourglass // <--- เพิ่ม Icon ใหม่
} from 'lucide-react';
import './Advisor.css';

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

  // Logic การนับจำนวน Summary (เพิ่มของใหม่เข้าไป)
  const stats = {
    notSent: reportData.filter(item => item.currentStatus === 'ยังไม่ส่งอีเมล').length, // <--- เพิ่ม
    pendingResult: reportData.filter(item => item.currentStatus === 'รอผลสัมภาษณ์').length, // <--- เพิ่ม
    waiting: reportData.filter(item => item.currentStatus === 'นัดวันสัมภาษณ์แล้ว').length,
    interviewed: reportData.filter(item => item.currentStatus === 'ผ่านการสัมภาษณ์').length,
    emailed: reportData.filter(item => item.currentStatus === 'ส่งอีเมลแล้วรอการตอบกลับ').length,
    testing: reportData.filter(item => item.currentStatus === 'ได้รับแบบทดสอบแล้ว').length,
    submittedTest: reportData.filter(item => item.currentStatus === 'ส่งแบบทดสอบแล้ว').length,
    failed: reportData.filter(item => item.currentStatus === 'ไม่ผ่านการสัมภาษณ์').length
  };

  const getStatusClass = (status: string) => {
    if (status === 'ผ่านการสัมภาษณ์') return 'status-pass';
    if (status === 'ไม่ผ่านการสัมภาษณ์') return 'status-fail';
    if (status === 'ยังไม่ส่งอีเมล') return 'status-not-sent'; 
    if (status === 'รอผลสัมภาษณ์') return 'status-waiting-result'; 
    if (status === 'ส่งแบบทดสอบแล้ว') return 'status-submitted-test';
    return 'status-process';
  };

  const handleCloseModal = () => setSelectedReport(null);

  return (
    <div className="advisor-page text-left">
      <div className="page-header-section">
        <h2 className="page-title">ติดตามสถานะการสมัครงาน</h2>
        <p className="page-subtitle">ตรวจสอบความคืบหน้าล่าสุดและรายละเอียดบันทึกของนักศึกษา</p>
      </div>

      {/* ส่วนสรุปรายละเอียด (Summary Section) */}
      <div className="summary-grid">
        {/* --- เพิ่ม Card ใหม่ 2 ใบด้านล่างนี้ --- */}
        <div className="summary-card muted">
          <div className="summary-icon-box"><Send size={20} /></div>
          <div className="summary-content">
            <span className="summary-label">ยังไม่ส่งอีเมล</span>
            <span className="summary-value">{stats.notSent} คน</span>
          </div>
        </div>

        <div className="summary-card warning">
          <div className="summary-icon-box"><Mail size={20} /></div>
          <div className="summary-content">
            <span className="summary-label">ส่งอีเมลแล้วรอการตอบกลับ</span>
            <span className="summary-value">{stats.emailed} คน</span>
          </div>
        </div>

        <div className="summary-card secondary">
          <div className="summary-icon-box"><ClipboardList size={20} /></div>
          <div className="summary-content">
            <span className="summary-label">ได้รับแบบทดสอบ</span>
            <span className="summary-value">{stats.testing} คน</span>
          </div>
        </div>

        <div className="summary-card indigo">
          <div className="summary-icon-box"><Send size={20} /></div> 
          <div className="summary-content">
            <span className="summary-label">ส่งแบบทดสอบแล้ว</span>
            <span className="summary-value">{stats.submittedTest} คน</span> 
          </div>
        </div>

        <div className="summary-card info">
          <div className="summary-icon-box"><Users size={20} /></div>
          <div className="summary-content">
            <span className="summary-label">นัดวันสัมภาษณ์แล้ว</span>
            <span className="summary-value">{stats.waiting} คน</span>
          </div>
        </div>

        <div className="summary-card warning-light">
          <div className="summary-icon-box"><Hourglass size={20} /></div>
          <div className="summary-content">
            <span className="summary-label">รอผลสัมภาษณ์</span>
            <span className="summary-value">{stats.pendingResult} คน</span>
          </div>
        </div>

        <div className="summary-card success">
          <div className="summary-icon-box"><UserCheck size={20} /></div>
          <div className="summary-content">
            <span className="summary-label">ผ่านสัมภาษณ์แล้ว</span>
            <span className="summary-value">{stats.interviewed} คน</span>
          </div>
        </div>

        <div className="summary-card danger">
          <div className="summary-icon-box"><UserX size={20} /></div>
          <div className="summary-content">
            <span className="summary-label">ไม่ผ่านสัมภาษณ์</span>
            <span className="summary-value">{stats.failed} คน</span>
          </div>
        </div>
      </div>

      <div className="advisor-card">
        <div className="table-responsive">
          <table className="advisor-table report-table">
            <thead>
              <tr>
                <th>โครงการ / บริษัท</th>
                <th>ชื่อนักศึกษา</th>
                <th className="min-w-220"><Activity size={16} className="icon-inline" /> สถานะปัจจุบัน</th>
                <th><Clock size={16} className="icon-inline" /> อัปเดตล่าสุด</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="project-info-mini">
                      <div className="title-text-small">{item.project}</div>
                      <div className="company-pos-text">
                        <Building2 size={12} /> {item.company} • {item.position}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="std-info-small">
                      <div className="std-name-text">{item.student}</div>
                      <div className="std-id-text">ID: {item.studentId}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge-custom ${getStatusClass(item.currentStatus)}`}>
                      {item.currentStatus === 'นัดวันสัมภาษณ์แล้ว' && item.interviewDate
                        ? `${item.currentStatus} (${item.interviewDate})`
                        : item.currentStatus}
                    </span>
                  </td>
                  <td><span className="last-update-text">{item.lastUpdate}</span></td>
                  <td>
                    <button className="btn-view-report" onClick={() => setSelectedReport(item)}>
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
        <div className="modal-overlay">
          <div className="modal-content-report">
            <div className="modal-header-report">
              <div>
                <h2 className="modal-title-report">
                  <FileText size={20} color="#3b82f6" /> รายละเอียดบันทึก
                </h2>
                <p className="modal-subtitle-report">
                  อัปเดตเมื่อ: {selectedReport.lastUpdate}
                </p>
              </div>
              <button className="btn-close-modal" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body-section">
              <h4>หัวข้อบันทึก</h4>
              <div className="report-box-title">{selectedReport.reportTitle}</div>
            </div>
            <div className="modal-body-section">
              <h4>รายละเอียด</h4>
              <div className="report-box-detail">{selectedReport.reportDetail}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}