import { useNavigate } from 'react-router-dom';
import { Plus, Edit2 } from 'lucide-react';
import './Company.css';

export default function CompanyProjects() {
    const navigate = useNavigate();
    
    const data = [
        { id: 1, name: "TTB tech & data Internship 2026", role: "UX/UI", slots: 2, status: "APPROVED" },
        { id: 2, name: "TTB tech & data Internship 2026", role: "Software Engineering", slots: 1, status: "PENDING" }
    ];

    return (
        <div className="company-page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>จัดการโครงการ</h1>
                <button 
                    className="btn-primary" 
                    onClick={() => navigate('/company/projects/create')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f97316', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                >
                    <Plus size={18} /> สร้างโครงการใหม่
                </button>
            </div>

            <div className="card form-card" style={{ background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <table className="project-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                            <th style={{ padding: '15px', borderBottom: '1px solid #e2e8f0' }}>ชื่อโครงการ</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #e2e8f0' }}>ตำแหน่ง</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #e2e8f0' }}>จำนวนรับ</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #e2e8f0' }}>สถานะ</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', textAlign: 'left' }}>
                                    <strong style={{ color: '#334155' }}>{item.name}</strong>
                                </td>

                                <td style={{ padding: '15px', color: '#f97316', fontWeight: 600 }}>
                                    {item.role}
                                </td>

                                <td style={{ padding: '15px', fontWeight: 600, color: '#475569' }}>
                                    {item.slots}
                                </td>

                                <td style={{ padding: '15px' }}>
                                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </td>

                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button 
                                        className="btn-edit-outline"
                                        onClick={() => navigate(`/company/projects/create`)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto', background: 'transparent', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', color: '#64748b', cursor: 'pointer' }}
                                    >
                                        <Edit2 size={16} /> แก้ไขข้อมูล
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}