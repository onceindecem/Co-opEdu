
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Shield, Users, Activity, LogOut } from 'lucide-react';
import './Admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
<div className="admin-container">
  
  <aside className="admin-sidebar">
    <div className="admin-logo">
      <div className="admin-logo-icon">
        <Shield size={24} />
      </div>
      <div className="admin-logo-text">
        <span className="brand">System Admin</span>
        <span className="role">ผู้ดูแลระบบ</span>
      </div>
    </div>

    <nav className="admin-nav">
      <NavLink to="/admin/users" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
        <Users size={20} /> จัดการผู้ใช้งาน
      </NavLink>
      <NavLink to="/admin/logs" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
        <Activity size={20} /> บันทึกระบบ (Audit Logs)
      </NavLink>
    </nav>
    
    <div className="admin-footer">
      <button className="btn-logout-sidebar" onClick={handleLogout}>
        <LogOut size={18} /> ออกจากระบบ
      </button>
    </div>
  </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>ยินดีต้อนรับ, ผู้ดูแลระบบ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><br></br>
            </div>
        </header>

        <div className="admin-content">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}