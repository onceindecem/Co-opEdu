import { useState, useEffect } from "react";
import {
  UserPlus,
  Key,
  Trash2,
  Users,
  AlertTriangle,
  X,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import "./Admin.css";
import { adminService } from "../../api/services/adminService";
import { useAuth } from "../../context/AuthContext";

export default function UserManagement() {
  const [userList, setUserList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'STUDENT' });
  const [newPassword, setNewPassword] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string;
  }>({ isOpen: false, userId: null, userName: "" });
  const [roleConfirm, setRoleConfirm] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string;
    oldRole: string;
    newRole: string;
  }>({ isOpen: false, userId: null, userName: "", oldRole: "", newRole: "" });
  const [resetPwdConfirm, setResetPwdConfirm] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string;
  }>({ isOpen: false, userId: null, userName: "" });

  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (user.role !== "ADMIN") {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้!");
      window.location.href = "/";
      return;
    }

    fetchUsers();
  }, [user, loading]);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      const formattedUsers = response.data.map((u: any) => ({
        id: u.userID,
        name: u.name || u.email,
        email: u.email,
        role: u.role,
        provider: u.provider || "LOCAL",
      }));
      setUserList(formattedUsers);
    } catch (error) {
      console.error("ดึงข้อมูลล้มเหลว:", error);
      alert("ไม่สามารถดึงข้อมูลผู้ใช้งานได้ โปรดตรวจสอบการเชื่อมต่อ Backend");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ, นามสกุล, Email, Password)');
      return;
    }
    try {
      await adminService.createUser(newUser);
      alert("สร้างบัญชีผู้ใช้งานสำเร็จ!");
      setShowAddModal(false);
      setNewUser({ firstName: '', lastName: '', email: '', password: '', role: 'STUDENT' });
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการสร้างบัญชี");
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirm.userId) {
      try {
        await adminService.deleteUser(deleteConfirm.userId);
        setDeleteConfirm({ isOpen: false, userId: null, userName: '' });
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert("ไม่สามารถลบผู้ใช้งานได้");
      }
    }
  };

  const confirmRoleChange = async () => {
    if (roleConfirm.userId) {
      try {
        await adminService.updateUserRole(
          roleConfirm.userId,
          roleConfirm.newRole,
        );
        setRoleConfirm({ ...roleConfirm, isOpen: false });
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert("ไม่สามารถเปลี่ยนสิทธิ์ได้");
      }
    }
  };

  const handleConfirmResetPassword = async () => {
    if (resetPwdConfirm.userId && newPassword) {
      try {
        await adminService.resetPassword(resetPwdConfirm.userId, newPassword);
        alert(`รีเซ็ตรหัสผ่านสำเร็จ!`);
        setResetPwdConfirm({ ...resetPwdConfirm, isOpen: false });
      } catch (error) {
        console.error(error);
        alert("ไม่สามารถเปลี่ยนรหัสผ่านได้");
      }
    }
  };

  const handleGeneratePassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  const filteredUsers = userList.filter(user =>
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-card">
      {/* ---------------- Header ---------------- */}
      <div className="admin-header-flex">
        <div>
          <h2 className="admin-title">
            <Users size={24} /> User Management
          </h2>
          <p className="admin-subtitle">จัดการสิทธิ์และบัญชีผู้ใช้งาน</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-add-user">
          <UserPlus size={18} /> เพิ่ม User ใหม่
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="ค้นหาชื่อ หรือ Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* ---------------- Table ---------------- */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ชื่อ / Email</th>
            <th>Role</th>
            <th>Provider</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={4} className="empty-state">
                ไม่พบข้อมูล หรือกำลังโหลด...
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      setRoleConfirm({
                        isOpen: true,
                        userId: user.id,
                        userName: user.name,
                        oldRole: user.role,
                        newRole: e.target.value,
                      })
                    }
                    className="role-select"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="ADVISOR">ADVISOR</option>
                    <option value="HR">COMPANY</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <span
                    className={`provider-badge ${user.provider === "GOOGLE" ? "badge-google" : "badge-local"}`}
                  >
                    {user.provider}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => {
                      setResetPwdConfirm({
                        isOpen: true,
                        userId: user.id,
                        userName: user.name,
                      });
                      setNewPassword("");
                    }}
                    className="action-btn btn-key"
                  >
                    <Key size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        isOpen: true,
                        userId: user.id,
                        userName: user.name,
                      })
                    }
                    className="action-btn btn-trash"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ---------------- Modals ---------------- */}
      {deleteConfirm.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content text-center">
            <div className="modal-icon-circle icon-red">
              <AlertTriangle size={32} color="#ef4444" />
            </div>
            <h3>ยืนยันการลบบัญชี?</h3>
            <p>
              คุณกำลังจะลบบัญชีของ <strong>{deleteConfirm.userName}</strong>
            </p>
            <div className="modal-actions">
              <button
                onClick={() =>
                  setDeleteConfirm({ ...deleteConfirm, isOpen: false })
                }
                className="btn-cancel"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="btn-confirm btn-danger"
              >
                ลบถาวร
              </button>
            </div>
          </div>
        </div>
      )}

      {roleConfirm.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content wide text-center">
            <div className="modal-icon-circle icon-blue">
              <ShieldCheck size={32} color="#0284c7" />
            </div>
            <h3>ยืนยันเปลี่ยนสิทธิ์ใช้งาน</h3>
            <p>
              เปลี่ยนสิทธิ์จาก{" "}
              <span className="text-strike">{roleConfirm.oldRole}</span> เป็น{" "}
              <strong>{roleConfirm.newRole}</strong>?
            </p>
            <div className="modal-actions">
              <button
                onClick={() =>
                  setRoleConfirm({ ...roleConfirm, isOpen: false })
                }
                className="btn-cancel"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmRoleChange}
                className="btn-confirm btn-primary"
              >
                ยืนยันเปลี่ยนสิทธิ์
              </button>
            </div>
          </div>
        </div>
      )}

      {resetPwdConfirm.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon-circle icon-yellow">
              <Key size={30} color="#d97706" />
            </div>
            <h3 className="text-center">Reset Password</h3>
            <div className="modal-form-group">
              <div>
                <label>รหัสผ่านใหม่</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="modal-input"
                  />
                  <button
                    onClick={handleGeneratePassword}
                    className="btn-generate"
                  >
                    <RefreshCw size={14} /> สุ่ม
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() =>
                  setResetPwdConfirm({ ...resetPwdConfirm, isOpen: false })
                }
                className="btn-cancel"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmResetPassword}
                disabled={!newPassword}
                className="btn-confirm btn-warning"
              >
                ยืนยันการเปลี่ยน
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content wide relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="modal-close-btn"
            >
              <X size={20} />
            </button>
            <h3
              style={{
                marginTop: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <UserPlus size={22} color="#f97316" /> สร้างบัญชีผู้ใช้ใหม่
            </h3>
            <div className="modal-form-group">
              <div>
                <label>ชื่อ</label>
                <input type="text" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} className="modal-input" placeholder="ไม่ต้องใส่คำนำหน้า" />
              </div>
              <div>
                <label>นามสกุล</label>
                <input type="text" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} className="modal-input" />
              </div>
              <div><label>Email</label><input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="modal-input" /></div>
              <div><label>รหัสผ่าน</label><input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="modal-input" /></div>
              <div>
                <label>บทบาท (Role)</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="modal-input" style={{ cursor: 'pointer' }}>
                  <option value="STUDENT">STUDENT</option>
                  <option value="ADVISOR">ADVISOR</option>
                  <option value="HR">COMPANY</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-cancel"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddUser}
                className="btn-confirm btn-orange"
              >
                สร้างบัญชี
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
