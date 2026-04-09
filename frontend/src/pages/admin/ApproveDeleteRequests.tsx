import React, { useState, useEffect } from 'react';
import { Check, X, Building2, Trash2, AlertCircle, Info, Loader2 } from 'lucide-react';
import { projectService } from '../../api/services/projectService';

export default function ApproveDeleteRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); 

  const [showPopup, setShowPopup] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const fetchDeleteRequests = async () => {
    setLoading(true);
    try {
      const response = await projectService.getPendingDeleteRequests();

      const formattedData = response.data.map((proj: any) => ({
        id: proj.projID, 
        projectName: proj.projName, 
        company: proj.company?.coNameTH || 'ไม่ระบุชื่อบริษัท', 
        requestDate: proj.updateAt
          ? new Date(proj.updateAt).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
          : 'ไม่มีข้อมูลวันที่', 
        reason: proj.deleteReason || 'โครงการเสร็จสิ้นหรือต้องการยกเลิก', 
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
    if (processing) return; 
    setShowPopup(false);
    setActiveRequest(null);
    setActionType(null);
  };

  const confirmAction = async () => {
    if (!activeRequest || !actionType) return;

    setProcessing(true);
    try {
      if (actionType === 'approve') {
        await projectService.approveDelete(activeRequest.id);
      } else {
        await projectService.rejectDelete(activeRequest.id);
      }

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
                disabled={processing} 
              >
                ยกเลิก
              </button>
              <button
                className={`btn-modal ${actionType === 'approve' ? 'btn-modal-confirm-approve' : 'btn-modal-confirm-reject'}`}
                onClick={confirmAction}
                disabled={processing} 
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
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