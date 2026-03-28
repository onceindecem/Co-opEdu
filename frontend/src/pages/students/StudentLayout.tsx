import { useState } from 'react'; 
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Briefcase, FileText, User, LogOut } from 'lucide-react';
import './StudentLayout.css';

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path: string) => location.pathname.includes(path) ? 'active' : '';

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="student-app">
      
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

      <nav className="student-nav">
        <div className="nav-container">
          <Link to="/student/projects" className="nav-logo">
            CO-OP <span>EDUCATION</span>
          </Link>

          <div className="nav-menu">
            <Link to="/student/projects" className={`nav-item ${isActive('projects')}`}>
              <Search size={18} /> <span>ค้นหาโครงการ</span>
            </Link>
            <Link to="/student/applications" className={`nav-item ${isActive('applications')}`}>
              <Briefcase size={18} /> <span>การสมัครของฉัน</span>
            </Link>
            <Link to="/student/reports" className={`nav-item ${isActive('reports')}`}>
              <FileText size={18} /> <span>บันทึกความคืบหน้า</span>
            </Link>
          </div>

          <div className="nav-user-zone">
            <Link to="/student/profile" className={`nav-profile ${isActive('profile')}`}>
              <div className="avatar">JD</div>
              <span className="user-name">John Doe</span>
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

      <main className="student-main">
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}