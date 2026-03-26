import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'; // 1. เพิ่ม useNavigate
import { Search, Briefcase, FileText, User, LogOut } from 'lucide-react';
import './StudentLayout.css';

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate(); // 2. ประกาศตัวแปรสำหรับนำทาง

  // ฟังก์ชันเช็คว่าเมนูไหนกำลัง Active อยู่ เพื่อเปลี่ยนสี
  const isActive = (path: string) => location.pathname.includes(path) ? 'active' : '';

  // 3. สร้างฟังก์ชัน Logout
  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      // ถ้ามี Token ใน LocalStorage ให้ลบตรงนี้ (เช่น localStorage.removeItem('token'))
      navigate('/login'); // ดีดไปหน้า Login
    }
  };

  return (
    <div className="student-app">
      <nav className="student-nav">
        <div className="nav-container">
          <Link to="/student/projects" className="nav-logo">
            CO-OP <span>STUDENT</span>
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
            
            {/* 4. ใส่ onClick ให้กับปุ่ม LogOut */}
            <button 
              className="btn-logout" 
              title="ออกจากระบบ" 
              onClick={handleLogout}
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