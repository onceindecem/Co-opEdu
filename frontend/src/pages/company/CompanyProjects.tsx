import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react'; 
import './Company.css';

export default function CompanyProjects() {
    const navigate = useNavigate();
    
    // State สำหรับจัดการ Modal
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [projects, setProjects] = useState([
        { id: 1, name: "TTB tech & data Internship 2026", role: "UX/UI", slots: 2, status: "APPROVED", deleteRequested: false },
        { id: 2, name: "TTB tech & data Internship 2026", role: "Software Engineering", slots: 1, status: "PENDING", deleteRequested: false }
    ]);

    // ฟังก์ชันเมื่อกดยืนยันใน Popup
    const confirmDeleteRequest = () => {
        if (deleteTarget !== null) {
            setProjects(prevProjects => 
                prevProjects.map(project => 
                    project.id === deleteTarget 
                        ? { ...project, deleteRequested: true } 
                        : project
                )
            );
            setDeleteTarget(null); // ปิดหน้าต่างยืนยัน
            setShowSuccess(true);   // เปิดหน้าต่างสำเร็จ
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
                        {projects.map(item => (
                            <tr key={item.id}>
                                <td><strong className="project-name">{item.name}</strong></td>
                                <td className="project-role-text">{item.role}</td>
                                <td className="project-slots-text">{item.slots}</td>
                                <td>
                                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <div className="action-group">
                                        <button className="btn-edit-outline" onClick={() => navigate(`/company/projects/create`)}>
                                            <Edit2 size={16} /> แก้ไข
                                        </button>
                                        
                                        {item.deleteRequested ? (
                                            <button className="btn-pending-delete" disabled>
                                                <Clock size={16} /> รออนุมัติลบ
                                            </button>
                                        ) : (
                                            <button className="btn-delete-outline" onClick={() => setDeleteTarget(item.id)}>
                                                <Trash2 size={16} /> ลบ
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Popup 1: ยืนยันการส่งคำขอ (แทน Alert/Confirm) --- */}
            {deleteTarget && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-content">
                        <div className="logout-modal-icon" style={{ background: '#fff7ed' }}>
                            <AlertCircle size={40} color="#f97316" />
                        </div>
                        <h2>ยืนยันการลบโครงการ</h2>
                        <p>ระบบจะส่งคำขอลบโครงการนี้ไปยังผู้ดูแลระบบ <br/> คุณต้องการดำเนินการต่อหรือไม่?</p>
                        <div className="logout-modal-actions">
                            <button className="btn-cancel-logout" onClick={() => setDeleteTarget(null)}>ยกเลิก</button>
                            <button className="btn-confirm-logout" onClick={confirmDeleteRequest}>ยืนยันการลบ</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Popup 2: แสดงสถานะส่งสำเร็จ --- */}
            {showSuccess && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-content">
                        <div className="logout-modal-icon" style={{ background: '#f0fdf4' }}>
                            <CheckCircle2 size={40} color="#22c55e" />
                        </div>
                        <h2>ส่งคำขอสำเร็จ</h2>
                        <p>ส่งคำขอลบโครงการไปยังผู้ดูแลระบบแล้ว <br/> กรุณารอการตรวจสอบ</p>
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