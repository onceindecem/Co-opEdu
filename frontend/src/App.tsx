import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Profile from "./pages/Profile";
import ProjectDetail from "./pages/ProjectDetail";
import "./App.css";

// --- Student Pages ---
import StudentLayout from "./pages/students/StudentLayout";
import StudentProjects from "./pages/students/Projects";
import StudentApplications from "./pages/students/Applications";
import StudentReports from "./pages/students/Reports";

// --- Company Pages ---
import CompanyLayout from "./pages/company/CompanyLayout";
import CompanyProjects from "./pages/company/CompanyProjects";
import CreateProject from "./pages/company/CreateProject";

// --- Advisor Pages ---
import AdvisorLayout from "./pages/advisor/AdvisorLayout";
import AvailableProjects from "./pages/advisor/AvailableProjects";
import MyProjects from "./pages/advisor/MyProjects";
import ManageStudents from "./pages/advisor/ManageStudents";
import AdvisorReports from "./pages/advisor/AdvisorReports";

// --- Admin Pages ---
import AdminLayout from "./pages/admin/AdminLayout";
import UserManagement from "./pages/admin/UserManagement";
import AuditLogs from "./pages/admin/AuditLogs";
import ApproveDeleteRequests from "./pages/admin/ApproveDeleteRequests";
import EditProject from "./pages/company/EditProject";
import { useEffect, useState } from "react";
import { authService } from "./api/services/authService";
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "./context/AuthContext";

function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await authService.getProfile();
      setUser(res.data.accountInfo);
      setProfile(res.data.profile);
      setLoading(false);
      
      return res.data.accountInfo.role; 
    } catch (error) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, checkAuth }}>
    <Routes>
      {/* Public Access */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Student */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["STUDENT"]}
          />
        }
      >
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/projects" replace />} />
          <Route path="projects" element={<StudentProjects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="reports" element={<StudentReports />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Company */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["HR"]}
          />
        }
      >
        <Route path="/company" element={<CompanyLayout />}>
          <Route index element={<Navigate to="/company/projects" replace />} />
          <Route path="projects" element={<CompanyProjects />} />
          <Route path="projects/create" element={<CreateProject />} />
          <Route path="projects/edit/:id" element={<EditProject />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Advisor */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["ADVISOR"]}
          />
        }
      >
        <Route path="/advisor" element={<AdvisorLayout />}>
          <Route index element={<Navigate to="projects/available" replace />} />
          <Route path="projects/available" element={<AvailableProjects />} />
          <Route path="projects/mine" element={<MyProjects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route
            path="projects/:projectId/students"
            element={<ManageStudents />}
          />
          <Route path="reports" element={<AdvisorReports />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          />
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="logs" element={<AuditLogs />} />
          <Route path="approve-delete" element={<ApproveDeleteRequests />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              flexDirection: "column",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <h1 style={{ color: "#f97316", fontSize: "5rem", margin: 0 }}>
              404
            </h1>
            <p style={{ fontSize: "1.2rem", color: "#64748b" }}>
              ขออภัย ไม่พบหน้าที่คุณต้องการ
            </p>
            <a
              href="/login"
              style={{
                backgroundColor: "#f97316",
                color: "white",
                padding: "10px 25px",
                borderRadius: "10px",
                textDecoration: "none",
                marginTop: "20px",
                fontWeight: "bold",
              }}
            >
              กลับสู่หน้าหลัก
            </a>
          </div>
        }
      />
    </Routes>
    </AuthContext.Provider>
  );
}

export default App;
