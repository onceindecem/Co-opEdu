import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Applications.css';
import { Trash2, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function StudentApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    const savedApps = JSON.parse(localStorage.getItem('myApplications') || '[]');
    setApplications(savedApps);
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      const updatedApps = applications.filter(app => app.id !== deleteTargetId);
      setApplications(updatedApps);
      localStorage.setItem('myApplications', JSON.stringify(updatedApps));
    }
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  return (
    <div className="apps-container">
      <div className="apps-header">
        <h1>การสมัครของฉัน</h1>
        <p>คุณสามารถสมัครโครงการได้สูงสุด 2 รายการ ({applications.length}/2)</p>
      </div>

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-icon">
              <AlertTriangle size={48} color="#ef4444" />
            </div>
            <h2>ยืนยันการยกเลิก</h2>
            <p>คุณต้องการยกเลิกการสมัครโครงการนี้ใช่หรือไม่?<br/>หากยกเลิกแล้วจะไม่สามารถกู้คืนได้</p>
            <div className="delete-modal-actions">
              <button onClick={cancelDelete} className="btn-cancel-modal">
                ปิดหน้าต่าง
              </button>
              <button onClick={confirmDelete} className="btn-confirm-modal">
                ยืนยันการยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="apps-list">
        {applications.map((app) => (
          <div key={app.id} className="app-item-card">
            
            <div className="card-top-row">
              <h3>{app.title}</h3>
              {app.status !== "APPROVED" && (
                <button
                  className="btn-icon-delete" 
                  onClick={() => handleDeleteClick(app.id)}
                  title="ยกเลิกการสมัคร"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <p className="company-text">{app.company}</p>

            <div className="card-bottom-row">
              <span className="app-date">สมัครเมื่อ: {app.date}</span>

              <div className="app-status-zone">
                {app.status === "PENDING" && (
                  <span className="status-tag pending"><Clock size={16} /> รอยืนยัน</span>
                )}
                {app.status === "APPROVED" && (
                  <span className="status-tag approved"><CheckCircle size={16} /> ผ่านการคัดเลือก</span>
                )}
                {app.status === "REJECTED" && (
                  <span className="status-tag rejected"><XCircle size={16} /> ไม่ผ่าน</span>
                )}
              </div>
            </div>
            
          </div>
        ))}

        {applications.length === 0 && (
          <div className="empty-state">
            <p>ยังไม่มีรายการสมัครโครงการ</p>
            <button
              onClick={() => navigate('/student/projects')}
              className="btn-go-find"
            >
              ไปหาโครงการเลย
            </button>
          </div>
        )}
      </div>
    </div>
  );
}