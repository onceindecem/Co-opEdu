import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // 👈 เอา BrowserRouter ที่ซ้ำซ้อนออก
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Profile from './pages/Profile';
import ProjectDetail from './pages/ProjectDetail';
import './App.css';

// --- Student Pages ---
import StudentLayout from './pages/students/StudentLayout';
import StudentProjects from './pages/students/Projects';
import StudentApplications from './pages/students/Applications';
import StudentReports from './pages/students/Reports';

// --- Company Pages ---
import CompanyLayout from './pages/company/CompanyLayout';
import CompanyProjects from './pages/company/CompanyProjects';
import CreateProject from './pages/company/CreateProject';

// --- Advisor Pages ---
import AdvisorLayout from './pages/advisor/AdvisorLayout';
import AvailableProjects from './pages/advisor/AvailableProjects';
import MyProjects from './pages/advisor/MyProjects';
import ManageStudents from './pages/advisor/ManageStudents';
import AdvisorReports from './pages/advisor/AdvisorReports';

// --- Admin Pages ---
import AdminLayout from './pages/admin/AdminLayout';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';
import ApproveDeleteRequests from './pages/admin/ApproveDeleteRequests';

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

          {/* 👈 เพิ่ม ProjectDetail ไว้ในกลุ่มนักศึกษา (path จะกลายเป็น /student/projects/:id อัตโนมัติ) */}
          <Route path="projects/:id" element={<ProjectDetail />} />

          <Route path="applications" element={<StudentApplications />} />
          <Route path="reports" element={<StudentReports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 2. Company Journey */}
        <Route path="/company" element={<CompanyLayout />}>
          <Route index element={<Navigate to="/company/projects" replace />} />
          <Route path="projects" element={<CompanyProjects />} />
          <Route path="projects/create" element={<CreateProject />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 3. Advisor Journey */}
        <Route path="/advisor" element={<AdvisorLayout />}>
          <Route index element={<Navigate to="projects/available" replace />} />
          <Route path="projects/available" element={<AvailableProjects />} />
          <Route path="projects/mine" element={<MyProjects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="projects/:projectId/students" element={<ManageStudents />} />
          <Route path="reports" element={<AdvisorReports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 4. Admin Journey */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="logs" element={<AuditLogs />} />
          {/* แก้จาก approve เป็น approve-delete ให้ตรงกับ Sidebar */}
          <Route path="approve-delete" element={<ApproveDeleteRequests />} />
          <Route path="profile" element={<Profile />} />
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