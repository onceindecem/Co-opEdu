import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderSearch, 
  Briefcase, 
  FileCheck, 
  LogOut,
  UserCircle 
} from 'lucide-react';
import './Advisor.css';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../../api/services/authService';

export default function AdvisorLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { 
      path: '/advisor/projects/available', 
      icon: <FolderSearch size={22} />, 
      label: 'อนุมัติโครงการใหม่' 
    },
    { 
      path: '/advisor/projects/mine', 
      icon: <Briefcase size={22} />, 
      label: 'โครงการในความดูแล' 
    },
    { 
      path: '/advisor/reports', 
      icon: <FileCheck size={22} />, 
      label: 'ตรวจรายงาน / Report' 
    },
  ];

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
          if (decoded.role !== "ADVISOR") {
            navigate("/login");
            return;
          }
  
          // get profile data from backend to display name in layout
          const response = await authService.getProfile();
          const dbData = response.data;
  
          const fullName =
            `${dbData.profile.firstName} ${dbData.profile.lastName}` || "Advisor";
  
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

  return (
    <div className="advisor-layout">
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
              className={`menu-item ${location.pathname.includes(item.path) ? 'active' : ''}`}
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
          <button className="btn-logout-sidebar">
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