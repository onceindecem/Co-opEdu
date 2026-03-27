import React, { useState } from 'react';
import './Reports.css';
import { Plus, X, FileText, Calendar, Edit, Trash2, Activity } from 'lucide-react';

export default function StudentReports() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [history, setHistory] = useState([
    { 
      id: 1, 
      title: "ส่ง Resume และ Portfolio", 
      detail: "ส่งไฟล์ผ่านระบบเรียบร้อยแล้ว", 
      currentStatus: "ส่งอีเมลแล้วรอการตอบกลับ",
      interviewDate: "",
      date: "24/03/2026", 
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    currentStatus: 'ส่งอีเมลแล้วรอการตอบกลับ',
    interviewDate: ''
  });

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ 
      title: '', 
      detail: '', 
      currentStatus: 'ส่งอีเมลแล้วรอการตอบกลับ', 
      interviewDate: '' 
    });
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      detail: item.detail,
      currentStatus: item.currentStatus,
      interviewDate: item.interviewDate || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("คุณต้องการลบบันทึกนี้ใช่หรือไม่?")) {
      setHistory(history.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submittedData = {
      ...formData,
      interviewDate: formData.currentStatus === 'นัดวันสัมภาษณ์แล้ว' ? formData.interviewDate : ''
    };

    if (editingId !== null) {
      setHistory(history.map(item => 
        item.id === editingId ? { ...item, ...submittedData } : item
      ));
    } else {
      const newEntry = {
        id: Date.now(),
        ...submittedData,
        date: new Date().toLocaleDateString('th-TH')
      };
      setHistory([newEntry, ...history]);
    }

    setShowModal(false);
    setEditingId(null);
  };

  const getStatusStyle = (status: string) => {
    if (status === 'ผ่านการสัมภาษณ์') {
      return { border: '1px solid #22c55e', backgroundColor: '#f0fdf4', color: '#15803d' }; // สีเขียว
    }
    if (status === 'ไม่ผ่านการสัมภาษณ์') {
      return { border: '1px solid #ef4444', backgroundColor: '#fef2f2', color: '#b91c1c' }; // สีแดง
    }
    return { border: '1px solid #f97316', backgroundColor: '#fff7ed', color: '#ea580c' }; 
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>บันทึกความคืบหน้า</h1>
        <button className="btn-add-report" onClick={handleAddNew}>
          <Plus size={20} /> เพิ่มบันทึกใหม่
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? <Edit size={20} /> : <Plus size={20} />} {editingId ? 'แก้ไขบันทึกความคืบหน้า' : 'เพิ่มบันทึกความคืบหน้าใหม่'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><X /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>หัวข้อบันทึก</label>
                <input 
                  type="text" 
                  placeholder="เช่น ส่ง Resume, ทำแบบทดสอบ..." 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label><Activity size={16}/> สถานะปัจจุบัน</label>
                <select 
                  value={formData.currentStatus} 
                  onChange={(e) => setFormData({...formData, currentStatus: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '5px' }}
                >
                  <option value="ส่งอีเมลแล้วรอการตอบกลับ">ส่งอีเมลแล้วรอการตอบกลับ</option>
                  <option value="ได้รับแบบทดสอบแล้ว">ได้รับแบบทดสอบแล้ว</option>
                  <option value="ส่งแบบทดสอบเเล้ว">ส่งแบบทดสอบเเล้ว</option>
                  <option value="ยังไม่ถูกเรียกสัมภาษณ์">ยังไม่ถูกเรียกสัมภาษณ์</option>
                  <option value="นัดวันสัมภาษณ์แล้ว">นัดวันสัมภาษณ์แล้ว</option>
                  <option value="รอการตอบรับ">รอการตอบรับ</option>
                  <option value="ผ่านการสัมภาษณ์">ผ่านการสัมภาษณ์</option>
                  <option value="ไม่ผ่านการสัมภาษณ์">ไม่ผ่านการสัมภาษณ์</option>
                </select>
              </div>

              {formData.currentStatus === 'นัดวันสัมภาษณ์แล้ว' && (
                <div className="form-group interview-date-field" style={{ marginTop: '15px' }}>
                  <label className="label-highlight" style={{ color: '#f97316', fontWeight: 'bold' }}>
                    <Calendar size={16} style={{ marginRight: '5px' }}/> ระบุวันที่นัดสัมภาษณ์
                  </label>
                  <input 
                    type="date" 
                    required 
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '5px' }}
                  />
                </div>
              )}

              <div className="form-group" style={{ marginTop: '15px' }}>
                <label>รายละเอียดเพิ่มเติม</label>
                <textarea 
                  rows={4} 
                  placeholder="อธิบายรายละเอียดเพิ่มเติม (ถ้ามี)..." 
                  value={formData.detail}
                  onChange={(e) => setFormData({...formData, detail: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '5px' }}
                ></textarea>
              </div>

              <button type="submit" className="btn-submit-report" style={{ marginTop: '20px' }}>
                {editingId ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="timeline">
        {history.map((item) => {
          const statusDisplay = item.currentStatus === 'นัดวันสัมภาษณ์แล้ว' && item.interviewDate
            ? `${item.currentStatus} (วันที่: ${item.interviewDate})`
            : item.currentStatus;

          return (
            <div key={item.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div className="timeline-date">{item.date}</div>
                  
                  <div className="timeline-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleEdit(item)} 
                      style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', padding: '4px' }}
                      title="แก้ไข"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      title="ลบ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="timeline-body">
                  <h4 style={{ color: '#431407', marginBottom: '8px' }}>
                    <FileText size={16} style={{ marginRight: '6px', position: 'relative', top: '2px' }}/>
                    {item.title}
                  </h4>
                  <p style={{ color: '#475569', lineHeight: '1.5', margin: '10px 0 16px 0' }}>{item.detail}</p>

                  <div>
                    <span style={{
                      ...getStatusStyle(item.currentStatus),
                      display: 'inline-block',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      {statusDisplay}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}