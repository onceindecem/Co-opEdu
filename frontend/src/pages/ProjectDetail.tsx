import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  ArrowLeft, Building2, MapPin, Users, Wrench,
  UserCheck, Phone, Mail, FileText, CheckCircle,
  Briefcase, UserCircle, Loader2, ShieldAlert, AlertTriangle
} from 'lucide-react';
import './students/Projects.css';
import { projectService } from '../api/services/projectService';
import { applicationService } from '../api/services/applicationService';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isCheckingQuota, setIsCheckingQuota] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false); 
  const [showApproveModal, setShowApproveModal] = useState(false); 
  const [showRejectModal, setShowRejectModal] = useState(false); 
  const [rejectReason, setRejectReason] = useState(''); 

  const { user, loading: authLoading } = useAuth();
  const currentRole = (user?.role || user?.userRole || user?.type)?.toUpperCase() || 'STUDENT';
  const currentUserId = user?.id || user?.userId || user?.sub || "";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const res = await projectService.getOne(id);
          const data = res.data;

          if (currentRole === 'STUDENT' && data.projStat !== 'APPROVED') {
            alert("โครงการนี้ยังไม่ได้รับการอนุมัติ");
            navigate('/student/projects');
            return;
          }
          setProject(data);
        }
      } catch (err: any) {
        if (err.response?.status === 401) navigate('/login');
        console.error("Error fetching project detail:", err);
      } finally {
        setLoading(false);
      }
    };

    // รอให้ Auth โหลดเสร็จก่อน ค่อยดึงข้อมูลโปรเจกต์
    if (!authLoading) {
        fetchDetail();
    }
  }, [id, navigate, currentRole, authLoading]);

  const confirmApprove = async () => {
    try {
      setIsApproving(true);
      if (!currentUserId) {
        alert("ไม่พบ ID อาจารย์ กรุณาล็อกอินใหม่");
        return;
      }
      
      await projectService.approveProject(id as string);
      setShowApproveModal(false); 
      
      const updated = await projectService.getOne(id as string);
      setProject(updated.data);
    } catch (err) {
      alert('❌ เกิดข้อผิดพลาดในการอนุมัติ');
      console.error(err);
    } finally {
      setIsApproving(false);
    }
  };

  const confirmReject = async () => {
    try {
      setIsApproving(true);
      await projectService.rejectProject(id as string); 
      
      alert('❌ ปฏิเสธโครงการเรียบร้อยแล้ว');
      setShowRejectModal(false); 
      navigate(-1); 
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการปฏิเสธโครงการ');
    } finally {
      setIsApproving(false);
    }
  };

  const handleApplyClick = async () => {
    try {
      setIsCheckingQuota(true);
      const res = await applicationService.getMyApplications();
      
      if (res.data.length >= 2) {
        alert("คุณไม่สามารถสมัครเพิ่มได้ เนื่องจากโควตาเต็มแล้ว (สูงสุด 2 โครงการ)");
        return;
      }

      const alreadyApplied = res.data.some((app: any) => app.project?.projID === id || app.projID === id);
      if (alreadyApplied) {
        alert("คุณได้สมัครโครงการนี้ไปแล้ว");
        return;
      }

      setIsConfirmOpen(true);
    } catch (err) {
      console.error("Error checking quota:", err);
      alert("ไม่สามารถตรวจสอบโควตาการสมัครได้ในขณะนี้");
    } finally {
      setIsCheckingQuota(false);
    }
  };

  const confirmApply = async () => {
    try {
      setIsApplying(true);
      if (!currentUserId) {
        alert("ไม่พบ ID นักศึกษา กรุณาล็อกอินใหม่");
        return;
      }

      await projectService.applyProject({
        projID: id as string,
        studentID: currentUserId
      });

      alert('✅ ส่งใบสมัครเข้าร่วมโครงการเรียบร้อยแล้ว!');
      setIsConfirmOpen(false);
      navigate('/student/applications'); 

    } catch (err: any) {
      alert(err.response?.data?.message || '❌ เกิดข้อผิดพลาดในการสมัครโครงการ');
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return <div className="loading-screen"><Loader2 className="animate-spin" /> กำลังโหลด...</div>;
  if (!project) return <div className="error-screen">ไม่พบข้อมูลโครงการ</div>;

  return (
    <div className="project-detail-container">

      {/* Modal ยืนยันการสมัคร (STUDENT) */}
      {isConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>ยืนยันการสมัครโครงการ</h3>
            <p>ต้องการส่งใบสมัครเข้าโครงการ <strong>{project.projNameTH || project.projName}</strong> ใช่หรือไม่?</p>
            <div className="modal-actions">
              <button 
                className="btn-outline-cancel" 
                onClick={() => setIsConfirmOpen(false)}
                disabled={isApplying}
              >
                ยกเลิก
              </button>
              <button 
                className="btn-confirm-apply" 
                onClick={confirmApply}
                disabled={isApplying}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isApplying ? <Loader2 className="animate-spin" size={18} /> : null}
                {isApplying ? 'กำลังดำเนินการ...' : 'ยืนยันการสมัคร'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ยืนยันการอนุมัติ (ADVISOR) */}
      {showApproveModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <CheckCircle size={50} color="#10b981" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ color: '#10b981', marginBottom: '10px' }}>ยืนยันการอนุมัติโครงการ</h3>
            <p style={{ color: '#4b5563', marginBottom: '20px' }}>
              คุณต้องการรับเป็นอาจารย์ที่ปรึกษาให้กับโครงการ <br/>
              <strong>{project.projName}</strong> ใช่หรือไม่?
            </p>
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button 
                className="btn-outline-cancel" 
                onClick={() => setShowApproveModal(false)}
                disabled={isApproving}
              >
                ยกเลิก
              </button>
              <button 
                className="btn-approve" 
                onClick={confirmApprove} 
                disabled={isApproving}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isApproving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                {isApproving ? 'กำลังดำเนินการ...' : 'ยืนยันการอนุมัติ'}
              </button>
            </div>
          </div>
        </div>
      )}

     {/* Modal ยืนยันการปฏิเสธ (ADVISOR) */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-center">
            <div className="modal-icon-danger">
              <AlertTriangle size={50} />
            </div>
            <h3 className="modal-title-danger">ยืนยันการปฏิเสธโครงการ</h3>
            <p className="modal-subtitle">
              คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธโครงการ <strong>{project.projName}</strong>?
            </p>
            <div className="modal-actions-center">
              <button 
                className="btn-outline-cancel" 
                onClick={() => setShowRejectModal(false)}
                disabled={isApproving}
              >
                ยกเลิก
              </button>
              <button 
                className="btn-confirm-danger"
                onClick={confirmReject} 
                disabled={isApproving}
              >
                {isApproving ? <Loader2 className="animate-spin" size={18} /> : <ShieldAlert size={18} />}
                {isApproving ? 'กำลังดำเนินการ...' : 'ยืนยันการปฏิเสธ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT SECTION */}
      <button className="btn-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> กลับ
      </button>

      <div className="detail-card">
        {/* Header Section */}
        <div className="detail-header-section">
          <div className="header-title-row">
            <div>
              <h1>{project.projName || 'ไม่มีชื่อโครงการ'}</h1>
              <p className="subtitle-en">{project.projNameEN}</p>
            </div>
            {currentRole === 'ADVISOR' && (
              <span className={`status-badge ${project.projStat?.toLowerCase()}`}>
                {project.projStat === 'APPROVED' ? 'อนุมัติแล้ว' : 'รอการตรวจสอบ'}
              </span>
            )}
          </div>
          <div className="company-badge">
            <Building2 size={20} className="icon-orange" />
            <strong>{project.company?.coNameTH || 'ไม่ระบุบริษัท'}</strong>
          </div>
        </div>

        {/* รายละเอียดโครงการ */}
        <div className="detail-section">
          <h3><FileText size={20} className="icon-blue" /> รายละเอียดโครงการ</h3>
          <div className="info-box">
            <div className="info-row-full">
              <strong className="info-label">วัตถุประสงค์โครงการ:</strong>
              <p className="info-value">{project.projDetail || 'ไม่มีข้อมูล'}</p>
            </div>
            <div className="info-grid-2col">
              <div>
                <strong className="info-label"><Users size={16}/> จำนวนที่รับ:</strong>
                <p className="info-value">{project.projAmount} คน</p>
              </div>
              <div>
                <strong className="info-label"><Briefcase size={16}/> สถานะ:</strong>
                <p className="info-value" style={{ color: '#f97316' }}>{project.projStat}</p>
              </div>
            </div>
            <div>
              <strong className="info-label"><MapPin size={16}/> สถานที่ปฏิบัติงาน:</strong>
              <p className="info-value">{project.company?.coAddr}</p>
            </div>
          </div>
        </div>

        {/* ลักษณะงาน */}
        <div className="detail-section">
          <h3><Wrench size={20} className="icon-amber" /> ลักษณะงานและทักษะที่ใช้</h3>
          <div className="info-box border-amber">
            <div className="info-row-item">
              <strong className="info-label">ลักษณะงานที่ต้องปฏิบัติ:</strong>
              <p className="info-value pre-wrap">{project.jobDescription || project.jd || 'ไม่ได้ระบุ'}</p>
            </div>
            <div>
              <strong className="info-label">เครื่องมือและทักษะที่ต้องการ:</strong>
              <p className="info-value">{project.skills || 'ไม่ได้ระบุ'}</p>
            </div>
          </div>
        </div>

        {/* ข้อมูล PM */}
        <div className="detail-section">
          <h3><UserCircle size={20} className="icon-purple" /> ข้อมูลผู้จัดการโครงการ (PM)</h3>
          <div className="mentor-grid info-box">
            <div><strong className="info-label">ชื่อ-นามสกุล:</strong><div className="info-value">{project.projectManager?.pmName || '-'}</div></div>
            <div><strong className="info-label">ตำแหน่ง:</strong><div className="info-value">{project.projectManager?.pmPos || '-'}</div></div>
            <div className="contact-row-full">
              <span><Phone size={14} /> {project.projectManager?.pmTel || '-'}</span>
              <span><Mail size={14} /> {project.projectManager?.pmEmail || '-'}</span>
            </div>
          </div>
        </div>

       {/* ข้อมูลอาจารย์ที่ปรึกษา */}
        {(project.advisor || project.Advisor || project.advID) && (
          <div className="detail-section">
            <h3><UserCheck size={20} className="icon-green" /> อาจารย์ที่ปรึกษาโครงการ</h3>
            <div className="info-box border-green">
              <strong className="info-label">ชื่ออาจารย์ที่ปรึกษา:</strong>
              <div className="info-value advisor-name">
                {
                  project.advisor?.firstName ? `อ. ${project.advisor.firstName} ${project.advisor.lastName}` :
                  project.Advisor?.firstName ? `อ. ${project.Advisor.firstName} ${project.Advisor.lastName}` :
                  project.advisor?.advName ? `อ. ${project.advisor.advName}` :
                  project.advID ? `(รหัสอาจารย์: ${project.advID})` : 
                  "รอการอนุมัติ"
                }
              </div>
            </div>
          </div>
        )}

       {/* Footer Buttons */}
        <div className="action-buttons">
          <button className="btn-close" onClick={() => navigate(-1)}>ปิดหน้าต่าง</button>

          {currentRole === 'STUDENT' && (
            <button 
              className="btn-apply-main" 
              onClick={handleApplyClick}
              disabled={isCheckingQuota} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isCheckingQuota ? <Loader2 className="animate-spin" size={18} /> : <Briefcase size={18} />}
              {isCheckingQuota ? 'กำลังตรวจสอบสิทธิ์...' : 'สมัครโครงการนี้'}
            </button>
          )}

          {currentRole === 'ADVISOR' && project.projStat === 'PENDING' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-approve" 
                onClick={() => setShowApproveModal(true)} 
              >
                <CheckCircle size={18} /> อนุมัติโครงการ
              </button>

              <button 
                className="btn-reject" 
                onClick={() => {
                  setRejectReason(''); 
                  setShowRejectModal(true);
                }} 
                style={{ 
                  backgroundColor: '#ef4444', 
                  color: 'white', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 'bold'
                }}
              >
                <ShieldAlert size={18} /> ปฏิเสธโครงการ
              </button>
            </div>
          )}

          {currentRole === 'ADVISOR' && project.projStat === 'APPROVED' && (
            <div className="approved-badge-status">
              <CheckCircle size={18} /> อนุมัติเรียบร้อยแล้ว
            </div>
          )}
          
          {currentRole === 'ADVISOR' && project.projStat === 'REJECTED' && (
            <div style={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldAlert size={18} /> ปฏิเสธโครงการนี้แล้ว
            </div>
          )}
        </div>
      </div>
    </div>
  );
}