import './Advisor.css';

export default function ManageStudents() {
  return (
    <div className="advisor-layout">
      <main className="advisor-main" style={{marginLeft: 0, padding: '40px 10%'}}>
        <button onClick={() => window.history.back()} style={{marginBottom: '20px', cursor: 'pointer'}}>← กลับ</button>
        <h1>จัดการนักศึกษาในโครงการ</h1>
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ชื่อ-นามสกุล</th>
                <th>การยืนยันสิทธิ์</th>
                <th>ผลการจ้างงาน (ตอนจบ)</th>
                <th>รายงาน</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>นายสมชาย เรียนดี</td>
                <td>
                  <button className="btn-orange" style={{padding: '8px 15px', fontSize: '0.8rem'}}>ยืนยัน</button>
                  <button style={{marginLeft: '5px', padding: '8px 15px', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>ปฏิเสธ</button>
                </td>
                <td>
                  <select style={{padding: '8px', borderRadius: '8px', border: '1px solid #ddd'}}>
                    <option value="">-- เลือกสถานะ --</option>
                    <option value="HIRED">HIRED (รับเข้าทำงาน)</option>
                    <option value="NOT_HIRED">NOT HIRED</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => window.location.href='/advisor/projects/1/reports'} style={{background: 'none', border: '1px solid var(--orange-kmitl)', color: 'var(--orange-kmitl)', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer'}}>ดู Report</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}