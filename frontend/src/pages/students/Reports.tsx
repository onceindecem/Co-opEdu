import React, { useState, useEffect } from 'react';
import './Reports.css';
import { Plus, X, FileText, Calendar, Edit, Trash2, Activity, Briefcase, AlertTriangle } from 'lucide-react';
import { reportService } from '../../api/services/reportService';
import { applicationService } from '../../api/services/applicationService';

// 🌟 กำหนด Type ให้ตรงกับ Database เพื่อให้ TypeScript ช่วยเช็ค
interface Report {
  repID: string;
  appID: string;
  repTopic: string;
  repStat: string;
  descDetail: string;
  interviewDate?: string;
  createAt: string;
  projectName?: string; // เอาไว้โชว์ชื่อโปรเจกต์
}

interface Application {
  appID: string;
  projectName: string;
}

export default function StudentReports() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 🌟 State สำหรับเก็บข้อมูลจาก API
  const [history, setHistory] = useState<Report[]>([]);
  const [applications, setApplications] = useState<Application[]>([]); // โปรเจกต์ที่สมัครผ่านแล้ว

  const [formData, setFormData] = useState({
    appID: '',
    repTopic: '',
    descDetail: '',
    repStat: 'EMAIL_SENT', // ใช้ ENUM เป็น Default
    interviewDate: ''
  });


  // 🌟 ดึงข้อมูลตอนเปิดหน้าเว็บ
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const appRes = await applicationService.getMyApplications();

      console.log('📌 เช็คสถานะ App ทั้งหมด:', appRes.data.map((item: any) => ({ 
        id: item.appID, 
        status: item.appStat 
      })));

      // 🌟 1. เพิ่มการกรอง (Filter) ตรงนี้ครับ!
      // ⚠️ ข้อควรระวัง: เช็คชื่อฟิลด์สถานะ (เช่น appStatus) และค่า (เช่น 'REJECTED', 'NOT_PASSED') 
      // ให้ตรงกับที่คุณตั้งไว้ใน Database Application ด้วยนะครับ
      const activeApps = appRes.data.filter((item: any) => 
        item.appStat === 'APPROVED'
      );

      // 🌟 2. เอาตัวที่กรองแล้ว (activeApps) มา Map แทน appRes.data
      const formattedApps = activeApps.map((item: any) => ({
        appID: item.appID,
        projectName: item.project?.projName || item.project?.projectName || 'ไม่ระบุชื่อโครงการ'
      }));

      setApplications(formattedApps); // Dropdown จะโชว์แค่อันที่ยังรอดอยู่

      const reportRes = await reportService.getMyReports();
      setHistory(reportRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      appID: '',
      repTopic: '',
      descDetail: '',
      repStat: 'EMAIL_SENT',
      interviewDate: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item: Report) => {
    setEditingId(item.repID);
    setFormData({
      appID: item.appID,
      repTopic: item.repTopic,
      descDetail: item.descDetail || '',
      repStat: item.repStat,
      interviewDate: item.interviewDate || ''
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  // 🌟 ยิง API ลบข้อมูล
  const confirmDelete = async () => {
    if (deleteTargetId !== null) {
      try {
        // 👇 แก้ตรงนี้
        await reportService.deleteReport(deleteTargetId);
        setHistory(history.filter(item => item.repID !== deleteTargetId));
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  // 🌟 ยิง API บันทึก/แก้ไขข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      interviewDate: formData.repStat === 'INTERVIEW_SCHEDULED' && formData.interviewDate ? formData.interviewDate : null
    };

    try {
      if (editingId) {
        // แก้ไข (PATCH) - ลบ setHistory ออก
        await reportService.updateReport(editingId, payload);
      } else {
        // สร้างใหม่ (POST) - ลบ setHistory ออก
        await reportService.createReport(payload);
      }

      // ปิดหน้าต่าง Modal เคลียร์ค่า ID
      setShowModal(false);
      setEditingId(null);

      // 🌟 สั่งให้ไปดึงข้อมูลใหม่จาก Database ทันที (ต้องใส่ await)
      await fetchInitialData();

    } catch (error) {
      console.error('Error saving report:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  // 🌟 แปลง ENUM เป็นข้อความภาษาไทย
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      EMAIL_SENT: 'ส่งอีเมลแล้วรอการตอบกลับ',
      TEST_RECEIVED: 'ได้รับแบบทดสอบแล้ว',
      TEST_SENT: 'ส่งแบบทดสอบเเล้ว',
      INTERVIEW_SCHEDULED: 'นัดวันสัมภาษณ์แล้ว',
      WAITING_FOR_RESULT: 'รอการตอบรับ',
      PASSED: 'ผ่านการสัมภาษณ์',
      NOT_PASSED: 'ไม่ผ่านการสัมภาษณ์'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    if (status === 'PASSED') return 'status-pass';
    if (status === 'NOT_PASSED') return 'status-fail';
    return 'status-pending';
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>บันทึกความคืบหน้า</h1>
        <button className="btn-add-report" onClick={handleAddNew}>
          <Plus size={20} /> เพิ่มบันทึกใหม่
        </button>
      </div>

      {/* --- Delete Modal --- */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-icon">
              <AlertTriangle size={48} color="#ef4444" />
            </div>
            <h2>ยืนยันการลบ</h2>
            <p>คุณต้องการลบบันทึกความคืบหน้านี้ใช่หรือไม่?<br />หากลบแล้วจะไม่สามารถกู้คืนได้</p>
            <div className="delete-modal-actions">
              <button onClick={cancelDelete} className="btn-cancel-modal">ปิดหน้าต่าง</button>
              <button onClick={confirmDelete} className="btn-confirm-modal">ยืนยันการลบ</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Add/Edit Modal --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {editingId ? <Edit size={20} /> : <Plus size={20} />}
                {editingId ? 'แก้ไขบันทึกความคืบหน้า' : 'เพิ่มบันทึกความคืบหน้าใหม่'}
              </h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><X /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><Briefcase size={16} /> โครงการที่สมัครไปแล้ว</label>
                <select
                  value={formData.appID}
                  onChange={(e) => setFormData({ ...formData, appID: e.target.value })}
                  required
                >
                  <option value="" disabled>-- กรุณาเลือกโครงการ --</option>
                  {applications.map(app => (
                    <option key={app.appID} value={app.appID}>{app.projectName}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>หัวข้อบันทึก</label>
                <input
                  type="text"
                  placeholder="เช่น ส่ง Resume, ทำแบบทดสอบ..."
                  required
                  value={formData.repTopic}
                  onChange={(e) => setFormData({ ...formData, repTopic: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label><Activity size={16} /> สถานะปัจจุบัน</label>
                {/* 🌟 เปลี่ยน Value เป็น ENUM ให้ตรงกับ Database */}
                <select
                  value={formData.repStat}
                  onChange={(e) => setFormData({ ...formData, repStat: e.target.value })}
                >
                  <option value="EMAIL_SENT">ส่งอีเมลแล้วรอการตอบกลับ</option>
                  <option value="TEST_RECEIVED">ได้รับแบบทดสอบแล้ว</option>
                  <option value="TEST_SENT">ส่งแบบทดสอบเเล้ว</option>
                  <option value="INTERVIEW_SCHEDULED">นัดวันสัมภาษณ์แล้ว</option>
                  <option value="WAITING_FOR_RESULT">รอการตอบรับ</option>
                  <option value="PASSED">ผ่านการสัมภาษณ์</option>
                  <option value="NOT_PASSED">ไม่ผ่านการสัมภาษณ์</option>
                </select>
              </div>

              {formData.repStat === 'INTERVIEW_SCHEDULED' && (
                <div className="form-group interview-date-field">
                  <label className="label-highlight">
                    <Calendar size={16} /> ระบุวันที่นัดสัมภาษณ์
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group">
                <label>รายละเอียดเพิ่มเติม</label>
                <textarea
                  rows={4}
                  placeholder="อธิบายรายละเอียดเพิ่มเติม (ถ้ามี)..."
                  value={formData.descDetail}
                  onChange={(e) => setFormData({ ...formData, descDetail: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-submit-report">
                {editingId ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Timeline --- */}
      <div className="timeline">
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>ยังไม่มีประวัติการส่งรายงาน</div>
        ) : (
          history.map((item) => {
            const statusDisplay = item.repStat === 'INTERVIEW_SCHEDULED' && item.interviewDate
              ? `${getStatusText(item.repStat)} (วันที่: ${new Date(item.interviewDate).toLocaleDateString('th-TH')})`
              : getStatusText(item.repStat);

            // หาชื่อโปรเจกต์จาก appID เพื่อมาแสดงผล
            const appInfo = applications.find(a => a.appID === item.appID);

            return (
              <div key={item.repID} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">

                  <div className="timeline-header-row">
                    <div className="timeline-date">{new Date(item.createAt).toLocaleDateString('th-TH')}</div>
                    <div className="timeline-actions">
                      <button onClick={() => handleEdit(item)} className="btn-icon-edit" title="แก้ไข">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(item.repID)} className="btn-icon-delete" title="ลบ">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="timeline-body">
                    <div className="timeline-project">
                      <Briefcase size={14} />
                      {appInfo ? appInfo.projectName : item.appID}
                    </div>

                    <h4 className="timeline-title">
                      <FileText size={16} />
                      {item.repTopic}
                    </h4>
                    <p className="timeline-detail">{item.descDetail}</p>

                    <div>
                      <span className={`status-pill ${getStatusClass(item.repStat)}`}>
                        {statusDisplay}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}