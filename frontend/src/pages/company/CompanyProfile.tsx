import './Company.css';

export default function CompanyProfile() {
  return (
    <div className="company-layout">
      <nav className="company-navbar">
        <div className="nav-brand">CO-OP COMPANY</div>
        <div className="nav-menu">
          <a href="/company/projects" className="nav-item">โครงการ</a>
          <a href="/company/profile" className="nav-item active">โปรไฟล์</a>
          <button className="btn-logout">Logout</button>
        </div>
      </nav>

      <main className="company-main">
        <div className="page-header">
          <h1>โปรไฟล์บริษัท</h1>
        </div>

        <div className="card" style={{maxWidth: '700px'}}>
          <form onSubmit={(e) => e.preventDefault()}>
            <h3 style={{marginBottom:'20px', color:'var(--company-blue)'}}>ข้อมูลผู้ประสานงาน</h3>
            <div className="form-group">
              <label>ชื่อบริษัท (ภาษาไทย)</label>
              <input type="text" defaultValue="บริษัท เอบีซี จำกัด" required />
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
              <div className="form-group">
                <label>เบอร์โทรศัพท์ติดต่อ</label>
                <input type="tel" defaultValue="02-123-4567" required />
              </div>
              <div className="form-group">
                <label>อีเมลผู้ประสานงาน</label>
                <input type="email" defaultValue="hr@abc.com" disabled />
              </div>
            </div>
            <div className="form-group">
              <label>ที่อยู่บริษัท</label>
              <textarea rows={3} defaultValue="123 ถ.ฉลองกรุง แขวงลำปลาทิว เขตลาดกระบัง กรุงเทพฯ" required />
            </div>
            <button type="submit" className="btn-primary">อัปเดตข้อมูลโปรไฟล์</button>
          </form>
        </div>
      </main>
    </div>
  );
}