import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react'; 
import { projectService } from '../../api/projectService';
import axios from 'axios';
import './Company.css';

// สร้าง Interface ให้ TypeScript รู้จักฟิลด์ที่ดึงมาจาก Backend
interface ProjectData {
  projID: string;
  projName: string;
  jd: string; // สมมติว่า role คือ jd
  quota: number; // สมมติว่า slots คือ quota
  projStat: string; // PENDING, APPROVED, DENIED
  deleteRequested?: boolean; // ฟิลด์จำลองสำหรับการลบในหน้าบ้าน
}

export default function CompanyProjects() {
    const navigate = useNavigate();
    
    // State สำหรับจัดการ Modal
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // State สำหรับเก็บข้อมูลจาก Backend
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    // 🌟 ฟังก์ชันดึงข้อมูลจาก Backend
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // อย่าลืมแก้ URL ให้ตรงกับพอร์ต Backend ของคุณนะครับ
                const response = await projectService.getAll();
                
                // นำข้อมูลที่ได้มาใส่ใน State (อาจจะต้องเพิ่ม deleteRequested ไปด้วย)
                const formattedProjects = response.data.map((proj: any) => ({
                    ...proj,
                    deleteRequested: false // ตั้งค่าเริ่มต้นให้ไม่มีคำขอลบ
                }));
                
                setProjects(formattedProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
                alert("เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

   // 🌟 ฟังก์ชันเมื่อกดยืนยันใน Popup ลบ (รวมร่างแล้ว)
    const confirmDeleteRequest = async () => {
        if (deleteTarget !== null) {
            try {
                // 1. เรียก API ยิงไปลบข้อมูลที่ Backend จริงๆ
                await projectService.delete(deleteTarget);

                // 2. อัปเดตตาราง: ลบโปรเจกต์นั้นออกจากหน้าเว็บทันที
                setProjects(prevProjects => prevProjects.filter(p => p.projID !== deleteTarget));

                // 3. ปิด Popup ยืนยัน และแสดง Popup สำเร็จ
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
                {/* 🌟 แสดงข้อความกำลังโหลด */}
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
                            {/* 🌟 ถ้าไม่มีข้อมูลให้โชว์ข้อความนี้ */}
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-4">ยังไม่มีโครงการในระบบ</td>
                                </tr>
                            ) : (
                                projects.map(item => (
                                    <tr key={item.projID}>
                                        {/* 🌟 ดึงข้อมูลจากฟิลด์จริงของ Backend มาโชว์ */}
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
                                                {/* 🌟 ลิงก์ไปหน้า Edit (ส่ง projID ไปด้วย) */}
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

            {/* --- Popup 1: ยืนยันการส่งคำขอ --- */}
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