import { useEffect, useState } from 'react'; // 👈 เพิ่ม useState, useEffect
import './Projects.css';
import { Search, MapPin, Briefcase, Loader2 } from 'lucide-react'; // เพิ่ม Loader2 ไว้ทำ Loading
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../api/projectService'; // 👈 Import service ที่เราสร้าง

export default function StudentProjects() {
  const navigate = useNavigate();
  
  // --- 1. สร้าง State สำหรับเก็บข้อมูล ---
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 2. ฟังก์ชันดึงข้อมูลจาก API ---
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getAll();
      setProjects(res.data);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- 3. ฟิลเตอร์ค้นหา (Client-side Search) ---
  const filteredProjects = projects.filter(p => 
    p.projNameTH?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.company?.coNameTH?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="projects-container">
      <div className="search-section">
        <h1>ค้นหาโอกาสที่ใช่สำหรับคุณ</h1>
        <div className="search-bar">
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
            filteredProjects.map((proj: any) => (
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

                <button 
                  className="btn-view" 
                  onClick={() => navigate(`/student/projects/${proj.projID}`)}
                >
                  ดูรายละเอียดและสมัคร
                </button>
              </div>
            ))
          ) : (
            <div className="no-data">ไม่พบโปรเจกต์ที่ตรงกับการค้นหา</div>
          )}
        </div>
      )}
    </div>
  );
}