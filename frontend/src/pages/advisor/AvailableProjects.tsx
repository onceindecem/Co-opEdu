import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  CheckCircle,
  XCircle,
  Info,
  Building2,
  Calendar,
  ChevronRight,
  AlertTriangle, // 🌟 เพิ่ม Icon สำหรับหน้า Reject
} from "lucide-react";
import { projectService } from "../../api/services/projectService"; // 🌟 อย่าลืมเช็ค path ตรงนี้นะครับว่าตรงกับไฟล์ API ในโปรเจกต์ของคุณ
import "./Advisor.css";

export default function AvailableProjects() {
  const navigate = useNavigate();

  // 🌟 เปลี่ยน state มารองรับข้อมูลจริง และเพิ่ม loading / search
  const [pendingProjects, setPendingProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- 🌟 State สำหรับควบคุม Modal (สไตล์เหมือน Student) ---
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState(""); // เก็บเหตุผลที่พิมพ์ใน textarea

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getAvailableForAdvisors();
      setPendingProjects(res.data || []);
    } catch (error) {
      console.error("ดึงข้อมูลโครงการไม่สำเร็จ:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 🌟 ฟังก์ชันเปิด Modal อนุมัติ ---
  const handleOpenApproveModal = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowApproveModal(true);
  };

  // --- 🌟 ฟังก์ชันยืนยันการอนุมัติ (เรียก API) ---
  const confirmApprove = async () => {
    if (!selectedProjectId) return;

    try {
      await projectService.approveProject(selectedProjectId);

      closeModals();
      fetchPendingProjects();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอนุมัติ:", error);
      alert("เกิดข้อผิดพลาดในการทำรายการ กรุณาลองใหม่อีกครั้ง");
    }
  };

  // --- 🌟 ฟังก์ชันเปิด Modal ปฏิเสธ ---
  const handleOpenRejectModal = (projectId: string) => {
    setSelectedProjectId(projectId);
    setRejectReason(""); // เคลียร์ค่าเก่า
    setShowRejectModal(true);
  };

  // --- 🌟 ฟังก์ชันยืนยันการปฏิเสธ (เรียก API) ---
  const confirmReject = async () => {
    if (!selectedProjectId) return;

    try {
      // ยิง API ไปเลย ไม่ต้องรอเหตุผลแล้ว
      await projectService.reject(selectedProjectId);

      closeModals();
      fetchPendingProjects();
      alert("❌ ปฏิเสธโครงการเรียบร้อยแล้ว");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการปฏิเสธ:", error);
      alert("เกิดข้อผิดพลาดในการทำรายการ กรุณาลองใหม่อีกครั้ง");
    }

    try {
      await projectService.rejectProject(selectedProjectId, rejectReason);
      closeModals();
      fetchPendingProjects();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการปฏิเสธ:", error);
      alert("เกิดข้อผิดพลาดในการทำรายการ กรุณาลองใหม่อีกครั้ง");
    }
  };

  // --- ฟังก์ชันปิด Modal ทั้งหมด ---
  const closeModals = () => {
    setShowApproveModal(false);
    setShowRejectModal(false);
    setSelectedProjectId(null);
    setRejectReason("");
  };

  // ฟังก์ชันค้นหา
  const filteredProjects = pendingProjects.filter((proj) => {
    const titleText = (proj.projName || proj.title || "")
      .toString()
      .toLowerCase();
    const companyText = (
      proj.company?.coNameTH ||
      proj.company?.coNameEN ||
      proj.companyName ||
      ""
    )
      .toString()
      .toLowerCase();
    const search = searchTerm.toLowerCase();
    return titleText.includes(search) || companyText.includes(search);
  });

  return (
    <div className="advisor-page">
      {/* 🌟 ==========================================
          MODAL SECTION (โครงสร้างสไตล์ StudentLayout)
      ========================================== */}

      {/* --- 🟢 1. Modal ยืนยันการอนุมัติ --- */}
      {showApproveModal && (
        <div className="advisor-modal-overlay">
          <div className="advisor-modal-content">
            <div className="advisor-modal-icon icon-success">
              <CheckCircle size={40} />
            </div>
            <h2>ยืนยันการอนุมัติ</h2>
            <p>
              คุณแน่ใจหรือไม่ว่าต้องการ <strong>รับเป็นอาจารย์ที่ปรึกษา</strong>{" "}
              ให้กับโครงการนี้?
              <br />
              เมื่ออนุมัติแล้ว โครงการจะเปิดให้นักศึกษาเข้าสมัครทันที
            </p>
            <div className="advisor-modal-actions">
              <button onClick={closeModals} className="btn-modal-cancel">
                ยกเลิก
              </button>
              <button
                onClick={confirmApprove}
                className="btn-modal-confirm-success"
              >
                ยืนยันการอนุมัติ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 🔴 2. Modal ระบุเหตุผลการปฏิเสธ --- */}
      {showRejectModal && (
        <div className="advisor-modal-overlay">
          <div className="advisor-modal-content">
            <div className="advisor-modal-icon icon-danger">
              <AlertTriangle size={40} />
            </div>
            <h2>ปฏิเสธโครงการ</h2>

            {/* เพิ่ม Textarea สำหรับพิมพ์เหตุผล */}

            <div className="advisor-modal-actions">
              <button onClick={closeModals} className="btn-modal-cancel">
                ยกเลิก
              </button>
              <button
                onClick={confirmReject}
                className="btn-modal-confirm-danger"
              >
                ยืนยันการปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 ==========================================
          MAIN CONTENT SECTION
      ========================================== */}
      <div className="page-header-section">
        <h2 className="page-title">โครงการที่รอการอนุมัติ</h2>
        <p className="page-subtitle">
          ตรวจสอบรายละเอียดโครงการและเลือกรับเป็นอาจารย์ที่ปรึกษา
        </p>
      </div>

      <div className="advisor-card">
        <div className="table-actions">
          <div className="search-wrapper">
            <Search size={18} />
            {/* 🌟 ผูก state กับช่องค้นหา */}
            <input
              type="text"
              placeholder="ค้นหาชื่อโครงการ หรือ บริษัท..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 🌟 แสดงสถานะ Loading ระหว่างรอข้อมูล */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            กำลังโหลดข้อมูล...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
          >
            ไม่มีโครงการที่รอการอนุมัติในขณะนี้
          </div>
        ) : (
          <table className="advisor-table">
            <thead>
              <tr>
                <th>ชื่อโครงการ / ตำแหน่งงาน</th>
                <th>บริษัท</th>
                <th>วันที่ส่ง</th>
                <th>จำนวนที่รับ</th>
                <th style={{ textAlign: "center" }}>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {/* 🌟 ใช้ข้อมูลที่กรองแล้วมาแสดงผล */}
              {filteredProjects.map((proj) => (
                <tr key={proj.projID || proj.id}>
                  <td className="proj-title-cell">
                    <div className="title-text">
                      {proj.projName || proj.title}
                    </div>
                    <button
                      className="btn-view-detail"
                      onClick={() =>
                        navigate(`/advisor/projects/${proj.projID || proj.id}`)
                      }
                    >
                      ดูรายละเอียด <ChevronRight size={14} />
                    </button>
                  </td>
                  <td>
                    <div className="company-info-cell">
                      <Building2 size={16} />{" "}
                      {proj.company?.coNameTH ||
                        proj.companyName ||
                        "ไม่ระบุบริษัท"}
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      {/* จัดรูปแบบวันที่จาก Backend ให้สวยงาม */}
                      <Calendar size={16} />
                      {proj.createdAt
                        ? new Date(proj.createdAt).toLocaleDateString("th-TH")
                        : proj.date}
                    </div>
                  </td>
                  <td
                    style={{ fontWeight: 700, color: "var(--company-orange)" }}
                  >
                    {proj.quota || proj.studentsNeeded} คน
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div className="action-buttons-group">
                      {/* 🌟 เปลี่ยนมาเรียกฟังก์ชันเปิด Modal */}
                      <button
                        className="btn-approve-claim"
                        onClick={() =>
                          handleOpenApproveModal(proj.projID || proj.id)
                        }
                        title="อนุมัติโครงการ"
                      >
                        <CheckCircle size={18} /> อนุมัติ
                      </button>

                      {/* 🌟 ปุ่มปฏิเสธ (ควรทำสไตล์ CSS เพิ่ม) */}
                      <button
                        className="btn-reject"
                        onClick={() =>
                          handleOpenRejectModal(proj.projID || proj.id)
                        }
                        title="ปฏิเสธโครงการ"
                      >
                        <XCircle size={18} /> ปฏิเสธ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="helper-note">
        <Info size={16} />
        <span>
          เมื่อกด <strong>"อนุมัติ"</strong> โครงการจะถูกเปลี่ยนสถานะเป็น
          APPROVED และคุณจะกลายเป็นอาจารย์ที่ปรึกษาทันที
        </span>
      </div>
    </div>
  );
}
