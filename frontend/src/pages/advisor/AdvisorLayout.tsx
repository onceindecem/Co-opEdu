import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderSearch, 
  Briefcase, 
  FileCheck, 
  LogOut,
  UserCircle 
} from 'lucide-react';
import './Advisor.css';

export default function AdvisorLayout() {
  const location = useLocation();

  // เมนูตามโครงสร้างที่คุณวางไว้
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

  return (
    <div className="advisor-layout">
      {/* --- SIDEBAR NAVBAR --- */}
      <aside className="advisor-sidebar">
        <div className="sidebar-header">
          <div className="logo-box">SC</div>
          <div className="logo-text">
            <span className="brand">CO-OP</span>
            <span className="role">EDUCATION</span>
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
              <p className="name">ดร. สมชาย สายชล</p>
              <p className="dept">Computer Science</p>
            </div>
          </div>
          <button className="btn-logout-sidebar">
            <LogOut size={18} /> <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="advisor-main-content">
        <div className="content-container">
          <Outlet /> {/* หน้าลูกอื่นๆ จะมาแสดงตรงนี้ */}
        </div>
      </main>
    </div>
  );
}