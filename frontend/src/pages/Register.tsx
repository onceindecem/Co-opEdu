import './Register.css';
import { Building2, UserPlus, ShieldCheck, MapPin, Phone, User, Briefcase, Mail } from 'lucide-react';

export default function RegisterPage() {
    return (
        <div className="reg-screen">
            <div className="reg-card">
                <div className="reg-header">
                    <UserPlus size={40} />
                    <h2>ลงทะเบียนบริษัทใหม่</h2>
                </div>

                <form className="reg-form">
                    <div className="form-section-title">
                        <User size={20} /> ข้อมูลผู้ใช้งาน / ผู้ประสานงาน
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label>ชื่อ (First Name)</label>
                            <input type="text" placeholder="กรุณากรอกชื่อ" required />
                        </div>
                        <div className="input-group">
                            <label>นามสกุล (Last Name)</label>
                            <input type="text" placeholder="กรุณากรอกนามสกุล" required />
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Phone size={14} /> เบอร์โทรศัพท์ส่วนตัว (Tel.)
                            </label>
                            <input type="tel" placeholder="กรุณากรอกเบอร์โทรติดต่อ" required />
                        </div>
                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Briefcase size={14} /> ตำแหน่ง (Position)
                            </label>
                            <input type="text" placeholder="กรุณากรอกตำแหน่งของคุณ" required />
                        </div>
                    </div>

                    <div className="form-section-title">
                        <ShieldCheck size={20} /> ข้อมูลการเข้าสู่ระบบ
                    </div>

                    <div className="input-group span-full">
                        <label>อีเมล (Email)</label>
                        <input type="email"  required />
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label>รหัสผ่าน (Password)</label>
                            <input type="password"  required />
                        </div>
                        <div className="input-group">
                            <label>ยืนยันรหัสผ่าน (Confirm Password)</label>
                            <input type="password"  required />
                        </div>
                    </div>

                    <div className="form-section-title">
                        <Building2 size={20} /> ข้อมูลสถานประกอบการ
                    </div>

                    <div className="input-group span-full">
                        <label>ชื่อบริษัท (ภาษาไทย)</label>
                        <input type="text" placeholder="บริษัท เอบีซี จำกัด" required />
                    </div>

                    <div className="input-group span-full">
                        <label>
                            ชื่อบริษัท (ภาษาอังกฤษ)
                            <span className="optional-text"> (ถ้ามี)</span>
                        </label>
                        <input type="text" maxLength={100} placeholder="ABC Co., Ltd." />
                    </div>

                    <div className="input-group span-full">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <MapPin size={16} /> ที่อยู่บริษัท
                        </label>
                        <textarea rows={3} placeholder="เลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ..." required></textarea>
                    </div>
                    <div className="input-row">
                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Mail size={16} /> อีเมลบริษัท (Email company)
                            </label>
                            <input type="email" placeholder="contact@company.com" required />
                        </div>
                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Phone size={16} /> เบอร์โทรบริษัท (Tel. Company)
                            </label>
                            <input type="tel" placeholder="02-123-4567" required />
                        </div>
                    </div>

                    <button type="submit" className="btn-reg">ยืนยันการลงทะเบียน</button>

                    <div className="back-to-login">
                        มีบัญชีบริษัทอยู่แล้ว? <a href="/login">กลับไปหน้าเข้าสู่ระบบ</a>
                    </div>
                </form>
            </div>
        </div>
    );
}