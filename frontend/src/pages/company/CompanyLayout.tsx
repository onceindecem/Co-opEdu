import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Building2, LogOut } from "lucide-react";
import "./Company.css";
import { jwtDecode } from "jwt-decode";
import { authService } from "../../api/services/authService";

export default function CompanyLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // State สำหรับจัดการ Popup Logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "Loading...",
  });

  const isActive = (path: string) =>
    location.pathname.includes(path) ? "active" : "";

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
        if (decoded.role !== "HR") {
          navigate("/login");
          return;
        }

        // get profile data from backend to display name in layout
        const response = await authService.getProfile();
        const dbData = response.data;

        const fullName =
          `${dbData.profile.hrFirstName} ${dbData.profile.hrLastName}` || "Company";

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

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/login");
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
            {/* หากบริษัทมีเมนูอื่นในอนาคต สามารถเพิ่มตรงนี้ได้ */}
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
