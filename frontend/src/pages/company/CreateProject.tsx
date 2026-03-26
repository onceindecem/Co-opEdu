import './Company.css';

export default function CreateProject() {
  const isEdit = false; 

  return (
    <div className="company-layout">
      <nav className="company-navbar">
        <div className="nav-brand">CO-OP COMPANY</div>
        <div className="nav-menu">
          <a href="/company/projects" className="nav-item">โครงการ</a>
          <a href="/company/profile" className="nav-item">โปรไฟล์</a>
          <button className="btn-logout">Logout</button>
        </div>
      </nav>

      <main className="company-main">
        <div className="page-header">
          <h1>{isEdit ? 'แก้ไขโครงการ' : 'แบบฟอร์มเสนอโครงการสหกิจศึกษา หลักสูตรวิทยาการคอมพิวเตอร์'}</h1>
        </div>

        <div className="card" style={{maxWidth: '600px', margin: '0 auto'}}>
          {isEdit && (
            <div className="alert-info">
              ⚠️ <strong>หมายเหตุ:</strong> การแก้ไขข้อมูลจะทำให้สถานะโครงการถูกเปลี่ยนเป็น <strong>PENDING</strong> เพื่อรอการอนุมัติใหม่
            </div>
          )}
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>ชื่อโครงการ / ตำแหน่งงาน</label>
              <input type="text" placeholder="ระบุชื่อตำแหน่งงาน" required />
            </div>
            <div className="form-group">
              <label>รายละเอียดงาน</label>
              <textarea rows={5} placeholder="ระบุรายละเอียดหน้าที่ความรับผิดชอบ" required />
            </div>
            <div className="form-group">
              <label>จำนวนนักศึกษาที่รับ (คน)</label>
              <input type="number" min="1" required />
            </div>
            <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
              <button type="submit" className="btn-primary">บันทึกข้อมูล</button>
              <button type="button" onClick={() => window.history.back()} style={{background:'#f1f5f9', border:'none', padding:'12px 24px', borderRadius:'10px', fontWeight:700, cursor:'pointer'}}>ยกเลิก</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}