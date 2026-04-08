import React, { useState, useEffect } from 'react';
import { Check, X, Building2, Trash2, AlertCircle, Info, Loader2 } from 'lucide-react';
// 🌟 1. Import Service เข้ามา (ปรับ path และชื่อ service ให้ตรงกับโปรเจกต์คุณ)
import { projectService } from '../../api/services/projectService';

export default function ApproveDeleteRequests() {
  // 🌟 2. เปลี่ยน State เริ่มต้นเป็น Array ว่าง และเพิ่ม Loading State
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); // สำหรับตอนกดยืนยันใน Modal

  const [showPopup, setShowPopup] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  // 🌟 3. ฟังก์ชันดึงข้อมูลคำขอลบโปรเจกต์จาก Backend
  const fetchDeleteRequests = async () => {
    setLoading(true);
    try {
      const response = await projectService.getPendingDeleteRequests();

      // 🌟 นำข้อมูลจาก Database มาแปลงให้ตรงกับที่ตารางหน้าบ้านต้องการโชว์
      const formattedData = response.data.map((proj: any) => ({
        id: proj.projID, // ใช้ projID เป็นไอดีหลัก
        projectName: proj.projName, // ชื่อโปรเจกต์
        company: proj.company?.coNameTH || 'ไม่ระบุชื่อบริษัท', // ดึงชื่อบริษัทจากตารางที่ Join มา
        requestDate: proj.updateAt
          ? new Date(proj.updateAt).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
          : 'ไม่มีข้อมูลวันที่', // 👈 ใส่ fallback ไว้กันพัง
        reason: proj.deleteReason || 'โครงการเสร็จสิ้นหรือต้องการยกเลิก', // 👈 เหตุผลการลบ
      }));

      setRequests(formattedData);
    } catch (error) {
      console.error("Failed to fetch delete requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeleteRequests();
  }, []);

  const openPopup = (req: any, type: 'approve' | 'reject') => {
    setActiveRequest(req);
    setActionType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    if (processing) return; // ถ้ากำลังโหลดอยู่ ห้ามปิด Modal
    setShowPopup(false);
    setActiveRequest(null);
    setActionType(null);
  };

  // 🌟 4. ฟังก์ชันยิง API เมื่อกดยืนยันใน Modal
  const confirmAction = async () => {
    if (!activeRequest || !actionType) return;

    setProcessing(true);
    try {
      if (actionType === 'approve') {
        // ยิง API อนุมัติการลบ
        await projectService.approveDelete(activeRequest.id);
      } else {
        // ยิง API ปฏิเสธการลบ
        await projectService.rejectDelete(activeRequest.id);
      }

      // อัปเดตตารางหน้าบ้านโดยเอาตัวที่จัดการแล้วออก
      setRequests(prev => prev.filter(req => req.id !== activeRequest.id));
      closePopup();
    } catch (error) {
      console.error(`Failed to ${actionType} request:`, error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="approve-delete-page">
      <div className="admin-header-flex">
        <h2><Trash2 size={24} color="#ef4444" /> อนุมัติการลบโครงการ</h2>
      </div>

      <div className="admin-card">
        {/* 🌟 5. แสดง Loading Spinner ตอนดึงข้อมูล */}
        {loading ? (
          <div className="flex-center-gap" style={{ padding: '40px', color: '#64748b' }}>
            <Loader2 className="animate-spin" size={24} /> กำลังโหลดข้อมูล...
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>โครงการ</th>
                <th>บริษัท</th>
                <th>วันที่ส่งคำขอ</th>
                <th>เหตุผล</th>
                <th style={{ textAlign: 'center' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req.id}>
                    {/* 🌟 ปรับ key เป็นฟิลด์จริงจาก DB เช่น req.projID */}
                    <td><div className="text-projectName">{req.projectName}</div></td>
                    <td>
                      <div className="company-info-flex">
                        <Building2 size={14} /> {req.company}
                      </div>
                    </td>
                    <td><span className="last-update-text">{req.requestDate}</span></td>
                    <td><div className="reason-text-box">{req.reason}</div></td>
                    <td>
                      <div className="flex-center-gap">
                        <button className="action-btn approve" onClick={() => openPopup(req, 'approve')} title="อนุมัติ">
                          <Check size={20} />
                        </button>
                        <button className="action-btn ban" onClick={() => openPopup(req, 'reject')} title="ปฏิเสธ">
                          <X size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state-wrapper">
                      <AlertCircle size={32} color="#94a3b8" />
                      <p style={{ color: '#64748b', marginTop: '10px' }}>ไม่มีคำขอลบโครงการในขณะนี้</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showPopup && activeRequest && (
        <div className="modal-overlay">
          <div className="modal-content-report">
            <div className={`modal-icon-wrapper ${actionType === 'approve' ? 'success' : 'danger'}`}>
              {actionType === 'approve' ? <Check size={32} /> : <Info size={32} />}
            </div>

            <h3 className="modal-title">
              {actionType === 'approve' ? 'ยืนยันการอนุมัติ' : 'ปฏิเสธคำขอ'}
            </h3>

            <p className="modal-description">
              คุณต้องการ{actionType === 'approve' ? 'อนุมัติการลบ' : 'ปฏิเสธคำขอลบ'}โครงการ <br />
              <strong>"{activeRequest.projectName}"</strong> ใช่หรือไม่?
            </p>

            <div className="modal-footer-gap">
              <button
                className="btn-modal btn-modal-cancel"
                onClick={closePopup}
                disabled={processing} // ปิดปุ่มถ้าระบบกำลังประมวลผล
              >
                ยกเลิก
              </button>
              <button
                className={`btn-modal ${actionType === 'approve' ? 'btn-modal-confirm-approve' : 'btn-modal-confirm-reject'}`}
                onClick={confirmAction}
                disabled={processing} // ปิดปุ่มถ้าระบบกำลังประมวลผล
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                {/* 🌟 6. เปลี่ยนข้อความปุ่มตอนกำลังโหลด */}
                {processing ? (
                  <><Loader2 size={18} className="animate-spin" /> กำลังดำเนินการ...</>
                ) : (
                  'ยืนยันดำเนินการ'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}