import { useEffect, useState } from 'react';
import './Projects.css';
import { Search, MapPin, Briefcase, Loader2, CheckCircle } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../api/services/projectService';
import { applicationService } from '../../api/services/applicationService'; 

export default function StudentProjects() {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [appliedProjectIds, setAppliedProjectIds] = useState<string[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

 const fetchData = async () => {
  setLoading(true);
  
  try {
    const projectsRes = await projectService.getAll();
    const approved = projectsRes.data.filter((p: any) => 
      p.projStat?.toUpperCase() === 'APPROVED'
    );
    setProjects(approved);
  } catch (err) {
    console.error("Projects Load Failed", err);
  }

  try {
    const appsRes = await applicationService.getMyApplications();
    setAppliedProjectIds(appsRes.data.map((a: any) => a.projID));
  } catch (err) {
    console.warn("Apps Load Failed (401?)", err);
  }
  
  setLoading(false);
};

  useEffect(() => {
    fetchData();
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
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อโครงการ หรือชื่อบริษัท..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-search">ค้นหา</button>
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
              const isApplied = appliedProjectIds.includes(proj.projID);

              return (
                <div className="project-card" key={proj.projID}>
                  <div className="card-content">
                    <h3 className="project-title">{proj.projNameTH}</h3>
                    <p className="position-text">{proj.projNameEN || 'General Position'}</p>
                    
                    <div className="company-info">
                      <span className="company-name">{proj.company?.coNameTH || 'ไม่ระบุชื่อบริษัท'}</span>
                    </div>
                    
                    <div className="details-group">
                      <div className="info-item">
                        <MapPin size={14} /> 
                        <span>{proj.company?.coAddr || 'ไม่ระบุสถานที่'}</span>
                      </div>
                      <div className="info-item">
                        <Briefcase size={14} /> 
                        <span>เปิดรับ {proj.projAmount || 0} ตำแหน่ง</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    {isApplied ? (
                      <button className="btn-applied" disabled>
                        <CheckCircle size={16} /> สมัครแล้ว
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