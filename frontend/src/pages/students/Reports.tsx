import './Reports.css';
import { Plus, Send, FileText } from 'lucide-react';

const REPORT_HISTORY = [
  { id: 1, title: "ส่ง Resume และ Portfolio", detail: "ส่งไฟล์ผ่านระบบเรียบร้อยแล้ว", date: "24/03/2026" },
  { id: 2, title: "สัมภาษณ์รอบแรก", detail: "สัมภาษณ์ผ่าน Zoom กับทีม HR", date: "25/03/2026" },
];

export default function StudentReports() {
  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>บันทึกความคืบหน้า</h1>
        <button className="btn-add-report">
          <Plus size={20} /> เพิ่มบันทึกใหม่
        </button>
      </div>

      <div className="timeline">
        {REPORT_HISTORY.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-date">{item.date}</div>
              <div className="timeline-body">
                <h4><FileText size={16} /> {item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}