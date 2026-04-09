import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { projectService } from '../../api/services/projectService';
import './Company.css';

interface ProjectData {
    projID: string;
    projName: string;
    jd: string; 
    quota: number;
    projStat: string; 
    deleteRequested?: boolean; 
}

export default function CompanyProjects() {
    const navigate = useNavigate();
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await projectService.getHRProjects();

                const formattedProjects = response.data.map((proj: any) => ({
                    ...proj,
                    deleteRequested: false
                }));

                setProjects(formattedProjects);
            } catch (error) {
                alert("เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const confirmDeleteRequest = async () => {
        if (deleteTarget !== null) {
            try {
                const reason = "ต้องการยกเลิกโครงการ"; 
                await projectService.requestDelete(deleteTarget, reason); 

                setProjects(prevProjects => 
                    prevProjects.map(p => 
                        p.projID === deleteTarget 
                            ? { ...p, deleteRequested: true } 
                            : p
                    )
                );

                setDeleteTarget(null);
                setShowSuccess(true);

            } catch (error: any) {
                console.error("ลบไม่สำเร็จ:", error);
                alert("เกิดข้อผิดพลาดในการลบโครงการ: " + (error.response?.data?.message || 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'));
            }
        }
    };

    return (
        <div className="company-page-container">
            <div className="page-header">
                <h1>จัดการโครงการ</h1>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/company/projects/create')}
                >
                    <Plus size={18} /> สร้างโครงการใหม่
                </button>
            </div>

            <div className="card form-card">
                {loading ? (
                    <div className="text-center p-4">กำลังโหลดข้อมูล...</div>
                ) : (
                    <table className="project-table">
                        <thead>
                            <tr>
                                <th>ชื่อโครงการ</th>
                                <th>ตำแหน่ง</th>
                                <th>จำนวนรับ</th>
                                <th>สถานะ</th>
                                <th className="text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-4">ยังไม่มีโครงการในระบบ</td>
                                </tr>
                            ) : (
                                projects.map(item => (
                                    <tr key={item.projID}>
                                        <td><strong className="project-name">{item.projName}</strong></td>
                                        <td className="project-role-text">{item.jd}</td>
                                        <td className="project-slots-text">{item.quota}</td>
                                        <td>
                                            <span className={`status-badge ${item.projStat.toLowerCase()}`}>
                                                {item.projStat}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="action-group">
                                                <button className="btn-edit-outline" onClick={() => navigate(`/company/projects/edit/${item.projID}`)}>
                                                    <Edit2 size={16} /> แก้ไข
                                                </button>

                                                {item.deleteRequested ? (
                                                    <button className="btn-pending-delete" disabled>
                                                        <Clock size={16} /> รออนุมัติลบ
                                                    </button>
                                                ) : (
                                                    <button className="btn-delete-outline" onClick={() => setDeleteTarget(item.projID)}>
                                                        <Trash2 size={16} /> ลบ
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {deleteTarget && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-content">
                        <div className="logout-modal-icon" style={{ background: '#fff7ed' }}>
                            <AlertCircle size={40} color="#f97316" />
                        </div>
                        <h2>ยืนยันการลบโครงการ</h2>
                        <p>ระบบจะส่งคำขอลบโครงการนี้ไปยังผู้ดูแลระบบ <br /> คุณต้องการดำเนินการต่อหรือไม่?</p>
                        <div className="logout-modal-actions">
                            <button className="btn-cancel-logout" onClick={() => setDeleteTarget(null)}>ยกเลิก</button>
                            <button className="btn-confirm-logout" onClick={confirmDeleteRequest}>ยืนยันการลบ</button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-content">
                        <div className="logout-modal-icon" style={{ background: '#f0fdf4' }}>
                            <CheckCircle2 size={40} color="#22c55e" />
                        </div>
                        <h2>ส่งคำขอสำเร็จ</h2>
                        <p>ส่งคำขอลบโครงการไปยังผู้ดูแลระบบแล้ว <br /> กรุณารอการตรวจสอบ</p>
                        <div className="logout-modal-actions">
                            <button
                                className="btn-confirm-logout"
                                style={{ background: '#f97316', width: '100%' }}
                                onClick={() => setShowSuccess(false)}
                            >
                                ตกลง
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}