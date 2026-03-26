import './Advisor.css';

export default function AdvisorReports() {
  return (
    <div className="advisor-layout">
      <main className="advisor-main" style={{marginLeft: 0, padding: '40px 10%'}}>
        <h1>ตรวจ Report นักศึกษา</h1>
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <h3>สัปดาห์ที่ 1: การออกแบบระบบ</h3>
            <a href="#" style={{color: 'var(--orange-kmitl)', fontWeight: 700}}>📄 ดูไฟล์ PDF</a>
          </div>
          <div style={{marginTop: '20px'}}>
            <label style={{display: 'block', fontWeight: 700, marginBottom: '10px'}}>Feedback จากอาจารย์:</label>
            <textarea style={{width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', minHeight: '120px'}} placeholder="พิมพ์คำแนะนำให้นักศึกษา..." />
            <div style={{textAlign: 'right', marginTop: '15px'}}>
              <button className="btn-orange">บันทึก Feedback</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}