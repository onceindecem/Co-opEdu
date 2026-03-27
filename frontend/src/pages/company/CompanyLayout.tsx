import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2, Briefcase, UserCircle, LogOut } from 'lucide-react';
import './Company.css';

export default function CompanyLayout() {
  const location = useLocation();

  return (
    <div className="company-layout">
      <nav className="company-navbar">
        <div className="nav-brand">
          <Building2 size={24} style={{ marginRight: '8px' }} />
          <span>CO-OP EDUCATION</span>
        </div>
        
        <div className="nav-menu">
          <Link 
            to="/company/projects" 
            className={`nav-item ${location.pathname.includes('/projects') ? 'active' : ''}`}
          >
            <Briefcase size={18} /> โครงการ
          </Link>
          <Link 
            to="/company/profile" 
            className={`nav-item ${location.pathname === '/company/profile' ? 'active' : ''}`}
          >
            <UserCircle size={18} /> โปรไฟล์องค์กร
          </Link>
          
          <Link to="/login" className="btn-logout">
            <LogOut size={18} /> 
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="company-main">
        <Outlet /> {/* เนื้อหาของ CreateProject, CompanyProjects จะมาโผล่ตรงนี้ */}
      </main>
    </div>
  );
}