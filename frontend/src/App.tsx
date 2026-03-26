import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import './App.css';

// --- Student Pages ---
import StudentLayout from './pages/students/StudentLayout';
import StudentProjects from './pages/students/Projects';
import StudentApplications from './pages/students/Applications';
import StudentReports from './pages/students/Reports';
import StudentProfile from './pages/students/Profile';

// --- Company Pages ---
import CompanyProjects from './pages/company/CompanyProjects';
import CreateProject from './pages/company/CreateProject';
import CompanyProfile from './pages/company/CompanyProfile';

// --- Advisor Pages (เพิ่มใหม่) ---
import Advisor from './pages/advisor/Advisor';
import ManageStudents from './pages/advisor/ManageStudents';
import AdvisorReports from './pages/advisor/AdvisorReports';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Access */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 1. Student Journey */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/projects" replace />} />
          <Route path="projects" element={<StudentProjects />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="reports" element={<StudentReports />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* 2. Company Journey */}
        <Route path="/company">
          <Route index element={<Navigate to="/company/projects" replace />} />
          <Route path="projects" element={<CompanyProjects />} />
          <Route path="projects/create" element={<CreateProject />} />
          <Route path="profile" element={<CompanyProfile />} />
        </Route>

        {/* 3. Advisor Journey (เพิ่มเข้าไปตรงนี้ครับ) */}
        <Route path="/advisor">
          {/* หน้าหลักแสดงรายการโปรเจกต์ที่ดูแล: /advisor/projects */}
          <Route path="projects" element={<Advisor />} />
          
          {/* หน้าจัดการเด็ก: /advisor/projects/[id]/students */}
          <Route path="projects/:id/students" element={<ManageStudents />} />
          
          {/* หน้าตรวจ Report: /advisor/projects/[id]/reports */}
          <Route path="projects/:id/reports" element={<AdvisorReports />} />
          
          {/* Default ของหน้า advisor ให้เด้งไปที่ projects */}
          <Route index element={<Navigate to="/advisor/projects" replace />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ color: '#f97316', fontSize: '5rem', margin: 0 }}>404</h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b' }}>ขออภัย ไม่พบหน้าที่คุณต้องการ</p>
            <a href="/login" style={{ 
              backgroundColor: '#f97316', 
              color: 'white', 
              padding: '10px 25px', 
              borderRadius: '10px', 
              textDecoration: 'none',
              marginTop: '20px',
              fontWeight: 'bold'
            }}>กลับสู่หน้าหลัก</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;