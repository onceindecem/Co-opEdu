import { Activity, Search, ShieldCheck, Clock } from 'lucide-react';
import './Admin.css';

export default function AuditLogs() {
  const logs = [
    {
      id: 1,
      time: '2026-03-28 14:30:15',
      user: 'admin@system.com',
      action: 'AUTH: LOGIN_SUCCESS',
      details: 'เข้าสู่ระบบสำเร็จผ่าน Local Provider',
      type: 'success'
    },
    {
      id: 2,
      time: '2026-03-28 10:15:00',
      user: 'unknown (IP: 192.168.1.10)',
      action: 'AUTH: LOGIN_FAILED',
      details: 'พยายามเข้าสู่ระบบด้วยรหัสผ่านผิดซ้ำ 3 ครั้ง (Brute-force Alert)',
      type: 'error'
    },
    {
      id: 3,
      time: '2026-03-27 18:45:22',
      user: 'somchai@student.ac.th',
      action: 'USER: PASSWORD_CHANGED',
      details: 'ผู้ใช้ทำการรีเซ็ตรหัสผ่านใหม่สำเร็จ',
      type: 'warning'
    },
    {
      id: 4,
      time: '2026-03-27 09:05:11',
      user: 'advisor.a@university.ac.th',
      action: 'PROJECT: APPROVED',
      details: 'อนุมัติโครงการ #PRJ-2026-001 ของนักศึกษา',
      type: 'info'
    }
  ];

  const getActionColor = (type: string) => {
    switch(type) {
      case 'success': return { bg: '#dcfce7', color: '#166534' };
      case 'error': return { bg: '#fee2e2', color: '#991b1b' };
      case 'warning': return { bg: '#fef3c7', color: '#92400e' };
      default: return { bg: '#e0f2fe', color: '#0369a1' };
    }
  };

  return (
    <div className="admin-card">
      
      <div className="admin-header-flex" style={{ marginBottom: '20px', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>
            <Activity size={24} style={{ color: '#f97316' }} /> บันทึกระบบ (Audit Logs)
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            <ShieldCheck size={14} style={{ display: 'inline', color: '#10b981' }}/> Security Logging and Monitoring (Read-only)
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '350px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="ค้นหาด้วย Email หรือ Action..." 
            style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>เวลาที่เกิดเหตุ (Timestamp)</th>
            <th>อีเมลคนทำ (User)</th>
            <th>ประเภท Action</th>
            <th>รายละเอียด (Details)</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const colors = getActionColor(log.type);
            return (
              <tr key={log.id}>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> {log.time}
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: '#1e293b' }}>{log.user}</td>
                <td>
                  <span style={{ 
                    background: colors.bg, 
                    color: colors.color, 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    fontFamily: 'monospace'
                  }}>
                    {log.action}
                  </span>
                </td>
                <td style={{ color: '#475569', fontSize: '0.85rem' }}>{log.details}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
    </div>
  );
}