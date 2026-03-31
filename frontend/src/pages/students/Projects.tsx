import { useEffect, useState } from 'react'; 
import './Projects.css';
import { Search, MapPin, Briefcase, Loader2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../api/services/projectService'; 

export default function StudentProjects() {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

 const fetchProjects = async () => {
  try {
    setLoading(true);
    const res = await projectService.getAll();
    
    // 🌟 เพิ่มบรรทัดนี้: กรองเอาเฉพาะโครงการที่ "APPROVED" เท่านั้น 🌟
    // ถ้าสถานะใน DB เป็นตัวเล็ก (approved) ให้แก้เป็น .toLowerCase() === 'approved' นะครับ
    const approvedProjects = res.data.filter((p: any) => p.projStat === 'APPROVED');
    
    setProjects(approvedProjects);
  } catch (err) {
    console.error("Error loading projects:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProjects();
  }, []);

  // ฟิลเตอร์ค้นหาจากชื่อโครงการและบริษัท
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
                
                {/* 🌟 2. เปลี่ยนป้ายสถานะเป็น "เปิดรับสมัคร" ให้ดูเป็นมิตรกับนักศึกษา 🌟 */}
                <div style={{ 
                  display: 'inline-block',
                  backgroundColor: '#dcfce7', 
                  color: '#166534', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}>
                  ✅ เปิดรับสมัคร
                </div>

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
            <div className="no-data">ไม่พบโปรเจกต์ที่เปิดรับสมัครในขณะนี้</div>
          )}
        </div>
      )}
    </div>
  );
}