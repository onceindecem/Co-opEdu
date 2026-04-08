import React, { useState, useEffect } from 'react';
import {
  Building2, Activity, Clock, Eye, X, FileText,
  UserCheck, Users, Mail, ClipboardList, UserX,
  Send, Hourglass 
} from 'lucide-react';
import './Advisor.css';
import { reportService } from '../../api/services/reportService';

const statusMap: { [key: string]: string } = {
  // เผื่อสถานะเริ่มต้นของ Application ไว้หน่อยเผื่อต้องใช้
  'PENDING': 'ยังไม่ส่งอีเมล', 

  // ตรงกับ ENUM ใน Database เป๊ะๆ
  'EMAIL_SENT': 'ส่งอีเมลแล้วรอการตอบกลับ',
  'TEST_RECEIVED': 'ได้รับแบบทดสอบ',
  'TEST_SENT': 'ส่งแบบทดสอบแล้ว',
  'INTERVIEW_SCHEDULED': 'นัดวันสัมภาษณ์แล้ว',
  'WAITING_FOR_RESULT': 'รอผลสัมภาษณ์',
  'PASSED': 'ผ่านสัมภาษณ์แล้ว',
  'NOT_PASSED': 'ไม่ผ่านสัมภาษณ์'
};

export default function AdvisorReports() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reportData, setReportData] = useState<any[]>([]); // 🌟 เปลี่ยนมาใช้ State แทน Mock Data
  const [isLoading, setIsLoading] = useState<boolean>(true); // 🌟 เพิ่ม State โหลดข้อมูล

  // 🌟 ดึงข้อมูลจาก API ทันทีที่เปิดหน้านี้
  useEffect(() => {
    fetchAdvisorReports();
  }, []);

  const fetchAdvisorReports = async () => {
    try {
      setIsLoading(true);
      // ยิง API ไปดึงข้อมูล (Token จะถูกแนบไปอัตโนมัติจาก axiosInstance)
      const res = await reportService.getAllReportsForAdvisor();
      
      // 🌟 แปลงข้อมูลจาก Backend ให้เข้ากับ UI ของตาราง
      // (ใช้ Optional Chaining (?.) เผื่อข้อมูลบางตัวเป็น null จะได้ไม่พัง)
 // 🌟 แปลงข้อมูลจาก Backend ให้เข้ากับ UI ของตาราง
      const formattedData = res.data.map((item: any) => {
        // ลองส่องดูใน Console ก่อนว่าไอเทมแต่ละตัวหน้าตาเป็นยังไง
        console.log("Single Item Check:", item);

        const user = item.application?.user;
        const studentData = user?.student || user?.Student;
        const email = user?.email || '';

        // 🌟 ทริคดึงรหัสนักศึกษาจากอีเมล (เช่น 66050379@kmitl.ac.th จะได้ 66050379)
        const extractedId = email.includes('@') ? email.split('@')[0] : '-';

        return {
          id: item.repID,
          project: item.application?.project?.projName || 'ไม่ระบุโครงการ',
          company: item.application?.project?.company?.coNameTH || 'ไม่ระบุบริษัท',
          position: item.application?.project?.position || 'ตำแหน่งงาน',
          
          // ⚠️ จุดสำคัญสำหรับชื่อ: 
          // ถ้าส่อง Console แล้วพบว่าชื่ออยู่ที่ user ตรงๆ ให้เปลี่ยนเป็น user?.firstName
          // ตอนนี้ผมตั้งให้มันลองดึงจากทั้ง studentData และ user ดูครับ ถ้าไม่ได้จริงๆ มันจะโชว์อีเมลเหมือนเดิม
          student: `${studentData?.firstName || user?.firstName || ''} ${studentData?.lastName || user?.lastName || ''}`.trim() || email || 'ไม่ระบุชื่อ',
          
          // 🌟 ใส่รหัสที่ได้จาก API ก่อน ถ้าไม่มีให้ใช้ตัวที่สกัดจากอีเมล
          studentId: studentData?.studentID || studentData?.studentId || extractedId,
          
          currentStatus: statusMap[item.repStat] || statusMap[item.application?.appStat] || item.repStat,
          
          interviewDate: item.interviewDate ? new Date(item.interviewDate).toLocaleDateString('th-TH') : '',
          lastUpdate: item.createAt ? new Date(item.createAt).toLocaleDateString('th-TH') : '-',
          reportTitle: item.repTopic,
          reportDetail: item.descDetail,
        };
      });

      setReportData(formattedData);
    } catch (error) {
      console.error('Error fetching advisor reports:', error);
      // ถ้าอยากเพิ่มแจ้งเตือน Error เช่น SweetAlert ใส่ตรงนี้ได้ครับ
    } finally {
      setIsLoading(false);
    }
  };

  // Logic การนับจำนวน Summary (คำนวณสดจาก reportData ที่ได้จาก API)
  const stats = {
    notSent: reportData.filter(item => item.currentStatus === 'ยังไม่ส่งอีเมล').length,
    pendingResult: reportData.filter(item => item.currentStatus === 'รอผลสัมภาษณ์').length,
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

  // 🌟 หน้าจอโหลดข้อมูลระหว่างรอ API
  if (isLoading) {
    return (
      <div className="advisor-page text-center" style={{ padding: '50px' }}>
        <Hourglass className="icon-inline" size={24} /> กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="advisor-page text-left">
      <div className="page-header-section">
        <h2 className="page-title">ติดตามสถานะการสมัครงาน</h2>
        <p className="page-subtitle">ตรวจสอบความคืบหน้าล่าสุดและรายละเอียดบันทึกของนักศึกษา</p>
      </div>

      {/* ส่วนสรุปรายละเอียด (Summary Section) */}
      <div className="summary-grid">
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
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center" style={{ padding: '20px' }}>
                    ไม่มีข้อมูลบันทึกความคืบหน้า
                  </td>
                </tr>
              ) : (
                reportData.map((item) => (
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
                ))
              )}
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