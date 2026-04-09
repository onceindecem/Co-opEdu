import { useState, useEffect } from 'react';
import { Activity, Search, ShieldCheck, Clock, Loader2 } from 'lucide-react';
import { activityLogService } from '../../api/services/activityLogService'; 
import './Admin.css';

interface ActivityLogData {
  logID: string;
  userID: string;
  action: string;
  details: string;
  timestamp: string;
  user?: { email: string };
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<ActivityLogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await activityLogService.getAll();
        setLogs(response.data);
      } catch (error) {
        console.error("Failed to fetch activity logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const determineLogType = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('SUCCESS') || act.includes('APPROVED')) return 'success';
    if (act.includes('FAILED') || act.includes('ERROR') || act.includes('DENIED')) return 'error';
    if (act.includes('WARNING') || act.includes('CHANGED') || act.includes('EDIT')) return 'warning';
    return 'info';
  };

  const getActionColor = (type: string) => {
    switch(type) {
      case 'success': return { bg: '#dcfce7', color: '#166534' };
      case 'error': return { bg: '#fee2e2', color: '#991b1b' };
      case 'warning': return { bg: '#fef3c7', color: '#92400e' };
      default: return { bg: '#e0f2fe', color: '#0369a1' };
    }
  };

  const filteredLogs = logs.filter(log => {
    const emailMatch = log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const actionMatch = log.action.toLowerCase().includes(searchTerm.toLowerCase());
    return emailMatch || actionMatch;
  });

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 🌟 ผูก State กับช่องค้นหา
            style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {loading ? (
         <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: '#64748b' }}>
           <Loader2 className="animate-spin" size={24} style={{ marginRight: '10px' }} /> กำลังโหลดข้อมูล...
         </div>
      ) : (
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
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const logType = determineLogType(log.action);
                const colors = getActionColor(logType);
                return (
                  <tr key={log.logID}>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> 
                        {new Date(log.timestamp).toLocaleString('th-TH')} {/* แปลงวันที่ให้อ่านง่าย */}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>
                      {log.user?.email || 'System / Unknown'}
                    </td>
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
              })
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  ไม่พบข้อมูลบันทึกระบบที่ค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}