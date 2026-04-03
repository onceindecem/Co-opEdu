import { useEffect, useState } from 'react';
import './Projects.css';
import { Search, MapPin, Briefcase, Loader2, CheckCircle } from 'lucide-react'; // 👈 เพิ่ม CheckCircle
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../api/services/projectService';
// 🌟 1. อย่าลืม Import Service ของ Application เข้ามาด้วย
import { applicationService } from '../../api/services/applicationService'; 

export default function StudentProjects() {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<any[]>([]);
  // 🌟 2. เพิ่ม State เก็บ ID ของโปรเจกต์ที่สมัครไปแล้ว
  const [appliedProjectIds, setAppliedProjectIds] = useState<string[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

 const fetchData = async () => {
  setLoading(true);
  
  // 1. ดึงโปรเจกต์ (อันนี้ต้องขึ้น)
  try {
    const projectsRes = await projectService.getAll();
    const approved = projectsRes.data.filter((p: any) => 
      p.projStat?.toUpperCase() === 'APPROVED' // 🌟 เช็กตัวพิมพ์ใหญ่
    );
    setProjects(approved);
  } catch (err) {
    console.error("Projects Load Failed", err);
  }

  // 2. ดึงประวัติการสมัคร (ถ้าอันนี้ 401 อันบนก็ยังทำงานได้)
  try {
    const appsRes = await applicationService.getMyApplications();
    setAppliedProjectIds(appsRes.data.map((a: any) => a.projID));
  } catch (err) {
    console.warn("Apps Load Failed (401?)", err);
  }
  
  setLoading(false);
};

  useEffect(() => {
    fetchData(); // เรียกใช้ fetchData แทนอันเดิม
  }, []);

  const filteredProjects = projects.filter(p => 
    p.projNameTH?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.company?.coNameTH?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="projects-container">
      <div className="search-section">
        <h1>ค้นหาโอกาสที่ใช่สำหรับคุณ</h1>
        <div className="search-bar">
          {/* ... ส่วน Search bar เหมือนเดิม ... */}
          <input 
            type="text" 
            placeholder="ค้นหาชื่อโครงการ หรือชื่อบริษัท..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-search">
            <Search size={18} /> ค้นหา
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" /> กำลังโหลดโปรเจกต์...
        </div>
      ) : (
        <div className="project-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((proj: any) => {
              // 🌟 5. เช็กว่าโปรเจกต์การ์ดใบนี้ อยู่ในลิสต์ที่เคยสมัครไปแล้วหรือยัง?
              const isApplied = appliedProjectIds.includes(proj.projID);

              return (
                <div className="project-card" key={proj.projID}>
                  <div className="status-badge">{proj.projStat}</div>
                  <h3>{proj.projNameTH}</h3>
                  <p className='position'>{proj.projNameEN || 'General Position'}</p>
                  <p className="company">{proj.company?.coNameTH || 'ไม่ระบุชื่อบริษัท'}</p>
                  
                  <div className="info-row">
                    <MapPin size={16} /> <span>{proj.company?.coAddr || 'ไม่ระบุสถานที่'}</span>
                  </div>
                  
                  <div className="info-row">
                    <Briefcase size={16} /> <span>รับสมัคร {proj.projAmount || 0} คน</span>
                  </div>

                  {/* 🌟 6. เปลี่ยนหน้าตาปุ่มตามสถานะการสมัคร */}
                  {isApplied ? (
                    <button className="btn-applied" disabled style={{ backgroundColor: '#22c55e', color: 'white', opacity: 0.8, cursor: 'not-allowed' }}>
                      <CheckCircle size={16} style={{ display: 'inline', marginRight: '5px' }} /> สมัครแล้ว
                    </button>
                  ) : (
                    <button 
                      className="btn-view" 
                      onClick={() => navigate(`/student/projects/${proj.projID}`)}
                    >
                      ดูรายละเอียดและสมัคร
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-data">ไม่พบโปรเจกต์ที่เปิดรับสมัครในขณะนี้</div>
          )}
        </div>
      )}
    </div>
  );
}