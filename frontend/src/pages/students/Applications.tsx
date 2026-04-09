import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Applications.css";
import {
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { applicationService } from "../../api/services/applicationService";

export default function StudentApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getMyApplications();
      setApplications(res.data);
    } catch (err) {
      console.error("Error loading applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId !== null) {
      try {
        await applicationService.deleteApplication(deleteTargetId);
        setApplications((prev) =>
          prev.filter((app) => (app.appID || app.id) !== deleteTargetId),
        );
      } catch (err) {
        alert("ไม่สามารถยกเลิกการสมัครได้ในขณะนี้");
        console.error("Delete error:", err);
      }
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
            <p>
              คุณต้องการยกเลิกการสมัครโครงการนี้ใช่หรือไม่?
              <br />
              หากยกเลิกแล้วจะไม่สามารถกู้คืนได้
            </p>
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

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" /> กำลังโหลดข้อมูล...
        </div>
      ) : (
        <div className="apps-list">
          {applications.map((app) => {
            const appId = app.appID;

            const projectTitle = app.project?.projName || "ไม่ระบุชื่อโครงการ";
            const companyName =
              app.project?.company?.coNameTH || "ไม่ระบุชื่อบริษัท";

            const applyDate = app.createAt
              ? new Date(app.createAt).toLocaleDateString("th-TH")
              : "ไม่ระบุวันที่";

            return (
              <div key={appId} className="app-item-card">
                <div className="card-top-row">
                  <h3>{projectTitle}</h3>
                  {app.appStat !== "APPROVED" && (
                    <button
                      className="btn-icon-delete"
                      onClick={() => handleDeleteClick(appId)}
                      title="ยกเลิกการสมัคร"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <p className="company-text">{companyName}</p>

                <div className="card-bottom-row">
                  <span className="app-date">สมัครเมื่อ: {applyDate}</span>

                  <div className="app-status-zone">
                    {app.appStat === "PENDING" && (
                      <span className="status-tag pending">
                        <Clock size={16} /> รอยืนยัน
                      </span>
                    )}
                    {(app.appStat === "APPROVED" ||
                      app.appStat === "ACCEPTED") && (
                      <span className="status-tag approved">
                        <CheckCircle size={16} /> ผ่านการคัดเลือก
                      </span>
                    )}
                    {(app.appStat === "REJECTED" ||
                      app.appStat === "DENIED") && (
                      <span className="status-tag rejected">
                        <XCircle size={16} /> ไม่ผ่าน
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {applications.length === 0 && (
            <div className="empty-state">
              <p>ยังไม่มีรายการสมัครโครงการ</p>
              <button
                onClick={() => navigate("/student/projects")}
                className="btn-go-find"
              >
                ไปหาโครงการเลย
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
