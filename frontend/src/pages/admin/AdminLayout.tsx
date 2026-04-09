import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Activity,
  LogOut,
  UserCircle,
  ClipboardCheck,
} from "lucide-react";
import "./Admin.css";
import { useEffect, useState } from "react";
import { authService } from "../../api/services/authService";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    name: "Loading...",
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.email || "Admin",
      });
    }
  }, [user]);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const cancelLogout = () => setShowLogoutModal(false);
  const confirmLogout = async () => {
    try {
      await authService.logout(); 
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setShowLogoutModal(false);
      navigate('/login', { replace: true }); 
    }
  };

  return (
    <div className="admin-container">
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal-content">
            <div className="logout-modal-icon">
              <LogOut size={40} color="#ef4444" />
            </div>
            <h2>ออกจากระบบ</h2>
            <p>คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบบัญชีของคุณ?</p>
            <div className="logout-modal-actions">
              <button onClick={cancelLogout} className="btn-cancel-logout">
                ยกเลิก
              </button>
              <button onClick={confirmLogout} className="btn-confirm-logout">
                ยืนยันการออก
              </button>
            </div>
          </div>
        </div>
      )}

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
            className={({ isActive }) =>
              isActive ? "admin-nav-item active" : "admin-nav-item"
            }
          >
            <Users size={20} /> <span>จัดการผู้ใช้งาน</span>
          </NavLink>
          <NavLink
            to="/admin/logs"
            className={({ isActive }) =>
              isActive ? "admin-nav-item active" : "admin-nav-item"
            }
          >
            <Activity size={20} /> <span>บันทึกระบบ (Audit Logs)</span>
          </NavLink>

          <NavLink
            to="/admin/approve-delete"
            className={({ isActive }) =>
              isActive ? "admin-nav-item active" : "admin-nav-item"
            }
          >
            <ClipboardCheck size={20} /> <span>อนุมัติการลบโครงการ</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="advisor-profile">
            <UserCircle size={32} className="profile-avatar-icon" />
            <div className="profile-info">
              <p className="name">{userInfo.name}</p>
              <p className="dept">Administrator</p>
            </div>
          </div>
          <button className="btn-logout-sidebar" onClick={handleLogoutClick}>
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
