import  { useState } from 'react';
import { Building2, Activity, Clock, Eye, X, FileText } from 'lucide-react';
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

  const getStatusClass = (status: string) => {
    if (status === 'ผ่านการสัมภาษณ์') return 'status-pass';
    if (status === 'ไม่ผ่านการสัมภาษณ์') return 'status-fail';
    return 'status-process';
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="advisor-page text-left">
      <div className="page-header-section">
        <h2 className="page-title">ติดตามสถานะการสมัครงาน</h2>
        <p className="page-subtitle">ตรวจสอบความคืบหน้าล่าสุดและรายละเอียดบันทึกของนักศึกษา</p>
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
                  <td>
                    <span className="last-update-text">{item.lastUpdate}</span>
                  </td>
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

            <div className="modal-body-section">
              <h4>สถานะในขณะนั้น</h4>
              <span className={`status-badge-custom ${getStatusClass(selectedReport.currentStatus)}`}>
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