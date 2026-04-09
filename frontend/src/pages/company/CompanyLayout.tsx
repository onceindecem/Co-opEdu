import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Building2, LogOut } from "lucide-react";
import "./Company.css";
import { jwtDecode } from "jwt-decode";
import { authService } from "../../api/services/authService";
import { useAuth } from "../../context/AuthContext";

export default function CompanyLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // State for controlling the visibility of the logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "Loading...",
  });

  const isActive = (path: string) =>
    location.pathname.includes(path) ? "active" : "";

  const { profile } = useAuth();
  
    useEffect(() => {
      if (profile) {
        setUserInfo({
          name: `${profile.hrFirstName} ${profile.hrLastName}` || "Company",
        });
      }
    }, [profile]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await authService.logout(); // 👈 ยิงไปหา Backend เพื่อให้ clearCookie ทำงาน!
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setShowLogoutModal(false);
      navigate('/login', { replace: true }); 
    }
  };
  
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="company-app">
      {/* --- Logout Confirmation Modal --- */}
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

      <nav className="company-nav">
        <div className="nav-container">
          <Link to="/company/projects" className="nav-logo">
            CO-OP <span>EDUCATION</span>
          </Link>

          <div className="nav-menu">
            <Link
              to="/company/projects"
              className={`nav-item ${isActive("projects")}`}
            >
              <Briefcase size={18} /> <span>โครงการ</span>
            </Link>
          </div>

          <div className="nav-user-zone">
            <Link
              to="/company/profile"
              className={`nav-profile ${isActive("profile")}`}
            >
              <div className="avatar">
                <Building2 size={16} />
              </div>
              <span className="user-name">{userInfo.name}</span>
            </Link>

            <button
              className="btn-logout"
              title="ออกจากระบบ"
              onClick={handleLogoutClick}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="company-main">
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
