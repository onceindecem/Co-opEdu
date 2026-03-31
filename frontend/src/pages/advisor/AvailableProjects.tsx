import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  Info,
  Building2,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { projectService } from '../../api/projectService'; // 🌟 อย่าลืมเช็ค path ตรงนี้นะครับว่าตรงกับไฟล์ API ในโปรเจกต์ของคุณ
import './Advisor.css';

export default function AvailableProjects() {
  const navigate = useNavigate();

  // 🌟 เปลี่ยน state มารองรับข้อมูลจริง และเพิ่ม loading / search
  const [pendingProjects, setPendingProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 🌟 ดึงข้อมูลเมื่อเปิดหน้าจอ
  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async () => {
    try {
      setLoading(true);
      // สมมติว่าใน projectService มีฟังก์ชันนี้เพื่อดึงโปรเจกต์ที่ยังไม่มีที่ปรึกษา
      const res = await projectService.getAvailableForAdvisors();
      setPendingProjects(res.data || []);
    } catch (error) {
      console.error("ดึงข้อมูลโครงการไม่สำเร็จ:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 ฟังก์ชันจัดการเมื่อกด "อนุมัติและรับดูแล"
  const handleApproveAndClaim = async (projectId: string) => {
    if (!window.confirm("คุณยืนยันที่จะรับเป็นอาจารย์ที่ปรึกษาให้กับโครงการนี้ใช่หรือไม่?")) return;

    try {
      // ส่งคำสั่งไปอัปเดตสถานะที่ Backend
      await projectService.approveProject(projectId);
      alert("อนุมัติและรับดูแลโครงการเรียบร้อยแล้ว!");
      fetchPendingProjects(); // รีเฟรชข้อมูลเพื่อเอาโครงการที่อนุมัติแล้วออกจากตาราง
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอนุมัติ:", error);
      alert("เกิดข้อผิดพลาดในการทำรายการ กรุณาลองใหม่อีกครั้ง");
    }
  };

  // 🌟 ฟังก์ชันค้นหา (กรองข้อมูลจาก searchTerm)
  const filteredProjects = pendingProjects.filter((proj) => {
    // ดึงชื่อโครงการออกมาเป็น String
    const titleText = (proj.projName || proj.title || "").toString().toLowerCase();

    // ดึงชื่อบริษัทออกมา (เช็คว่าถ้ามาเป็น Object ให้เข้าถึงฟิลด์ข้างใน)
    const companyText = (
      proj.company?.coNameTH ||
      proj.company?.coNameEN ||
      proj.companyName ||
      ""
    ).toString().toLowerCase();

    const search = searchTerm.toLowerCase();

    return titleText.includes(search) || companyText.includes(search);
  });

  return (
    <div className="advisor-page">
      <div className="page-header-section">
        <h2 className="page-title">โครงการที่รอการอนุมัติ</h2>
        <p className="page-subtitle">ตรวจสอบรายละเอียดโครงการและเลือกรับเป็นอาจารย์ที่ปรึกษา</p>
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
          <div style={{ textAlign: 'center', padding: '40px' }}>กำลังโหลดข้อมูล...</div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>ไม่มีโครงการที่รอการอนุมัติในขณะนี้</div>
        ) : (
          <table className="advisor-table">
            <thead>
              <tr>
                <th>ชื่อโครงการ / ตำแหน่งงาน</th>
                <th>บริษัท</th>
                <th>วันที่ส่ง</th>
                <th>จำนวนที่รับ</th>
                <th style={{ textAlign: 'center' }}>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {/* 🌟 ใช้ข้อมูลที่กรองแล้วมาแสดงผล */}
              {filteredProjects.map((proj) => (
                <tr key={proj.projID || proj.id}>
                  <td className="proj-title-cell">
                    <div className="title-text">{proj.projName || proj.title}</div>
                    <button
                      className="btn-view-detail"
                      onClick={() => navigate(`/advisor/projects/${proj.projID || proj.id}`)}
                    >
                      ดูรายละเอียด <ChevronRight size={14} />
                    </button>
                  </td>
                  <td>
                    <div className="company-info-cell">
                      <Building2 size={16} /> {proj.company?.coNameTH || proj.companyName || "ไม่ระบุบริษัท"}
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      {/* จัดรูปแบบวันที่จาก Backend ให้สวยงาม */}
                      <Calendar size={16} />
                      {proj.createdAt ? new Date(proj.createdAt).toLocaleDateString('th-TH') : proj.date}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--company-orange)' }}>
                    {proj.quota || proj.studentsNeeded} คน
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {/* 🌟 ผูกฟังก์ชันเข้ากับปุ่มอนุมัติ */}
                    <button
                      className="btn-approve-claim"
                      onClick={() => handleApproveAndClaim(proj.projID || proj.id)}
                    >
                      <CheckCircle size={18} /> อนุมัติและรับดูแล
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="helper-note">
        <Info size={16} />
        <span>เมื่อกด <strong>"อนุมัติและรับดูแล"</strong> โครงการจะถูกเปลี่ยนสถานะเป็น APPROVED และคุณจะกลายเป็นอาจารย์ที่ปรึกษาทันที</span>
      </div>
    </div>
  );
}