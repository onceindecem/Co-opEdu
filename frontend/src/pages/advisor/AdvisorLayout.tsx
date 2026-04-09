import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FolderSearch,
  Briefcase,
  FileCheck,
  LogOut,
  UserCircle,
} from "lucide-react";
import "./Advisor.css";
import { useEffect, useState } from "react";
import { authService } from "../../api/services/authService";
import { useAuth } from "../../context/AuthContext";

export default function AdvisorLayout() {
  const location = useLocation();
  const navigate = useNavigate(); 

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

  const menuItems = [
    {
      path: "/advisor/projects/available",
      icon: <FolderSearch size={22} />,
      label: "อนุมัติโครงการใหม่",
    },
    {
      path: "/advisor/projects/mine",
      icon: <Briefcase size={22} />,
      label: "โครงการในความดูแล",
    },
    {
      path: "/advisor/reports",
      icon: <FileCheck size={22} />,
      label: "ตรวจรายงาน / Report",
    },
  ];

  const [userInfo, setUserInfo] = useState({
    name: "Loading...",
  });

  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      setUserInfo({
        name: `${profile.firstName} ${profile.lastName}` || "Advisor",
      });
    }
  }, [profile]);

  return (
    <div className="advisor-layout">
      {/* Popup logout */}
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

      <aside className="advisor-sidebar">
        <div className="sidebar-header">
          <div className="logo-box">CS</div>
          <div className="logo-text">
            <span className="brand">CO-OP</span>
            <span className="role"> EDUCATION</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${location.pathname.includes(item.path) ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="advisor-profile">
            <UserCircle size={32} color="#94a3b8" />
            <div className="profile-info">
              <p className="name">{userInfo.name}</p>
              <p className="dept">Computer Science</p>
            </div>
          </div>
          <button className="btn-logout-sidebar" onClick={handleLogoutClick}>
            <LogOut size={18} /> <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      <main className="advisor-main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
