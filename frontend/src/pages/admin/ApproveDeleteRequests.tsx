import React, { useState } from 'react';
import { Check, X, Building2, Trash2, AlertCircle, Info } from 'lucide-react';

export default function ApproveDeleteRequests() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      projectName: "AI Chatbot for Customer Service",
      company: "TechNova Co.",
      requestDate: "28/03/2026",
      reason: "โครงการเสร็จสิ้นและต้องการเคลียร์ข้อมูล",
    },
    {
      id: 2,
      projectName: "Inventory System v1",
      company: "Global Logistics",
      requestDate: "29/03/2026",
      reason: "ยกเลิกตำแหน่งงานนี้ถาวร",
    }
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const openPopup = (req: any, type: 'approve' | 'reject') => {
    setActiveRequest(req);
    setActionType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setActiveRequest(null);
    setActionType(null);
  };

  const confirmAction = () => {
    setRequests(requests.filter(req => req.id !== activeRequest.id));
    closePopup();
  };

  return (
    <div className="approve-delete-page">
      <div className="admin-header-flex">
        <h2><Trash2 size={24} color="#ef4444" /> อนุมัติการลบโครงการ</h2>
      </div>

      <div className="admin-card">
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
                    <AlertCircle size={32} />
                    <p>ไม่มีคำขอลบโครงการในขณะนี้</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
              <button className="btn-modal btn-modal-cancel" onClick={closePopup}>
                ยกเลิก
              </button>
              <button 
                className={`btn-modal ${actionType === 'approve' ? 'btn-modal-confirm-approve' : 'btn-modal-confirm-reject'}`}
                onClick={confirmAction}
              >
                ยืนยันดำเนินการ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}