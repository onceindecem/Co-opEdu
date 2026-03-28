import React, { useState } from 'react';
import './Reports.css';
import { Plus, X, FileText, Calendar, Edit, Trash2, Activity, Briefcase, AlertTriangle } from 'lucide-react'; 

export default function StudentReports() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- เพิ่ม State สำหรับ Popup ยืนยันการลบ ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [history, setHistory] = useState([
    { 
      id: 1, 
      project: "โครงการสหกิจศึกษา (Co-op)", 
      title: "ส่ง Resume และ Portfolio", 
      detail: "ส่งไฟล์ผ่านระบบเรียบร้อยแล้ว", 
      currentStatus: "ส่งอีเมลแล้วรอการตอบกลับ",
      interviewDate: "",
      date: "24/03/2026", 
    },
  ]);

  const [formData, setFormData] = useState({
    project: '',
    title: '',
    detail: '',
    currentStatus: 'ส่งอีเมลแล้วรอการตอบกลับ',
    interviewDate: ''
  });

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ 
      project: '',
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
      project: item.project || '', 
      title: item.title,
      detail: item.detail,
      currentStatus: item.currentStatus,
      interviewDate: item.interviewDate || ''
    });
    setShowModal(true);
  };

  // --- ฟังก์ชันสำหรับการลบ (อัปเดตใหม่) ---
  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      setHistory(history.filter(item => item.id !== deleteTargetId));
    }
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
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

  const getStatusClass = (status: string) => {
    if (status === 'ผ่านการสัมภาษณ์') return 'status-pass';
    if (status === 'ไม่ผ่านการสัมภาษณ์') return 'status-fail';
    return 'status-pending';
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>บันทึกความคืบหน้า</h1>
        <button className="btn-add-report" onClick={handleAddNew}>
          <Plus size={20} /> เพิ่มบันทึกใหม่
        </button>
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-icon">
              <AlertTriangle size={48} color="#ef4444" />
            </div>
            <h2>ยืนยันการลบ</h2>
            <p>คุณต้องการลบบันทึกความคืบหน้านี้ใช่หรือไม่?<br/>หากลบแล้วจะไม่สามารถกู้คืนได้</p>
            <div className="delete-modal-actions">
              <button onClick={cancelDelete} className="btn-cancel-modal">
                ปิดหน้าต่าง
              </button>
              <button onClick={confirmDelete} className="btn-confirm-modal">
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Add/Edit Modal (อันเดิม) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {editingId ? <Edit size={20} /> : <Plus size={20} />} 
                {editingId ? 'แก้ไขบันทึกความคืบหน้า' : 'เพิ่มบันทึกความคืบหน้าใหม่'}
              </h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><X /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><Briefcase size={16}/> โครงการที่สมัครไปแล้ว</label>
                <select 
                  value={formData.project} 
                  onChange={(e) => setFormData({...formData, project: e.target.value})}
                  required
                >
                  <option value="" disabled>-- กรุณาเลือกโครงการ --</option>
                  <option value="TTB tech & data Internship 2026">TTB tech & data Internship 2026</option>
                  <option value="AI Chatbot for Customer Service">AI Chatbot for Customer Service</option>
                </select>
              </div>

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
                >
                  <option value="ส่งอีเมลแล้วรอการตอบกลับ">ส่งอีเมลแล้วรอการตอบกลับ</option>
                  <option value="ได้รับแบบทดสอบแล้ว">ได้รับแบบทดสอบแล้ว</option>
                  <option value="ส่งแบบทดสอบเเล้ว">ส่งแบบทดสอบเเล้ว</option>
                  <option value="นัดวันสัมภาษณ์แล้ว">นัดวันสัมภาษณ์แล้ว</option>
                  <option value="รอการตอบรับ">รอการตอบรับ</option>
                  <option value="ผ่านการสัมภาษณ์">ผ่านการสัมภาษณ์</option>
                  <option value="ไม่ผ่านการสัมภาษณ์">ไม่ผ่านการสัมภาษณ์</option>
                </select>
              </div>

              {formData.currentStatus === 'นัดวันสัมภาษณ์แล้ว' && (
                <div className="form-group interview-date-field">
                  <label className="label-highlight">
                    <Calendar size={16} /> ระบุวันที่นัดสัมภาษณ์
                  </label>
                  <input 
                    type="date" 
                    required 
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
                  />
                </div>
              )}

              <div className="form-group">
                <label>รายละเอียดเพิ่มเติม</label>
                <textarea 
                  rows={4} 
                  placeholder="อธิบายรายละเอียดเพิ่มเติม (ถ้ามี)..." 
                  value={formData.detail}
                  onChange={(e) => setFormData({...formData, detail: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="btn-submit-report">
                {editingId ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Timeline --- */}
      <div className="timeline">
        {history.map((item) => {
          const statusDisplay = item.currentStatus === 'นัดวันสัมภาษณ์แล้ว' && item.interviewDate
            ? `${item.currentStatus} (วันที่: ${item.interviewDate})`
            : item.currentStatus;

          return (
            <div key={item.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                
                <div className="timeline-header-row">
                  <div className="timeline-date">{item.date}</div>
                  <div className="timeline-actions">
                    <button onClick={() => handleEdit(item)} className="btn-icon-edit" title="แก้ไข">
                      <Edit size={16} />
                    </button>
                    {/* เปลี่ยนไปเรียกฟังก์ชัน handleDeleteClick แทน */}
                    <button onClick={() => handleDeleteClick(item.id)} className="btn-icon-delete" title="ลบ">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="timeline-body">
                  <div className="timeline-project">
                    <Briefcase size={14} />
                    {item.project}
                  </div>
                  
                  <h4 className="timeline-title">
                    <FileText size={16} />
                    {item.title}
                  </h4>
                  <p className="timeline-detail">{item.detail}</p>

                  <div>
                    <span className={`status-pill ${getStatusClass(item.currentStatus)}`}>
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