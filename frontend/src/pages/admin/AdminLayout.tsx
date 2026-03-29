import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Shield, Users, Activity, LogOut, UserCircle, ClipboardCheck } from 'lucide-react';
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
          <NavLink
            to="/admin/users"
            className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
          >
            <Users size={20} /> <span>จัดการผู้ใช้งาน</span>
          </NavLink>
          <NavLink
            to="/admin/logs"
            className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
          >
            <Activity size={20} /> <span>บันทึกระบบ (Audit Logs)</span>
          </NavLink>
          
          <NavLink
            to="/admin/approve-delete"
            className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
          >
            <ClipboardCheck size={20} /> <span>อนุมัติการลบโครงการ</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="advisor-profile">
            <UserCircle size={32} className="profile-avatar-icon" />
            <div className="profile-info">
              <p className="name">Admin01</p>
              <p className="dept">Administrator</p>
            </div>
          </div>
          <button className="btn-logout-sidebar" onClick={handleLogout}>
            <LogOut size={18} /> <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-welcome-group">
            <span className="welcome-text">ยินดีต้อนรับ, ผู้ดูแลระบบ</span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}