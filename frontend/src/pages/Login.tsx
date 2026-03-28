import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login with:", email, password);
    navigate('/student/projects'); 
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <h2>เข้าสู่ระบบ</h2>
          <p className="login-subtitle">ระบบบริหารจัดการสหกิจศึกษา (Co-op System)</p>
        </div>
        
        <form onSubmit={handleCustomLogin}>
          <div className="input-field">
            <label>อีเมล</label>
            <input 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-field">
            <label>รหัสผ่าน</label>
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-login">เข้าสู่ระบบ</button>
        </form>

        <div className="separator"><span>หรือเข้าสู่ระบบด้วย</span></div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin 
            onSuccess={() => navigate('/student/projects')}
            onError={() => console.log('Login Failed')}
            theme="outline"
            shape="pill"
            width="100%"
          />
        </div>

        <div className="register-link">
          ยังไม่มีบัญชีบริษัทใช่ไหม? <a href="/register">ลงทะเบียนเลย</a>
        </div>
      </div>
    </div>
  );
}