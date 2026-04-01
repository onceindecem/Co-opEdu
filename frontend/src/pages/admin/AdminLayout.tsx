import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Shield, Users, Activity, LogOut, UserCircle, ClipboardCheck } from 'lucide-react';
import './Admin.css';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../../api/services/authService';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
      name: "Loading...",
    });
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            navigate("/login");
            return;
          }
  
          // check role from token first
          const decoded: any = jwtDecode(token);
          if (decoded.role !== "ADMIN") {
            navigate("/login");
            return;
          }
  
          // get profile data from backend to display name in layout
          const response = await authService.getProfile();
          const dbData = response.data;
  
          const fullName =
            `${dbData.accountInfo.email}` || "Admin";
  
          setUserInfo({
            name: fullName
          });
        } catch (error) {
          console.error("Failed to fetch layout profile:", error);
          navigate("/login");
        }
      };
  
      fetchUserData();
    }, [navigate]);

  // 🌟 State สำหรับควบคุม Popup Logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 🌟 ฟังก์ชันจัดการ Logout
  const handleLogoutClick = () => setShowLogoutModal(true);
  const cancelLogout = () => setShowLogoutModal(false);
  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <div className="admin-container">

      {/* 🌟 Popup ยืนยันการออกจากระบบ */}
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
              <p className="name">{userInfo.name}</p>
              <p className="dept">Administrator</p>
            </div>
          </div>
          {/* 🌟 เปลี่ยนมาใช้ฟังก์ชัน handleLogoutClick */}
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