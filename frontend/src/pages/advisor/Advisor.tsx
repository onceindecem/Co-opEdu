export default function AdvisorProjects() {
  const projects = [
    { id: 'p1', title: "AI for Agriculture", company: "AgriTech Co." },
    { id: 'p2', title: "KMITL Mobile App", company: "Computer Center" }
  ];

  return (
    <div className="advisor-layout">
      <aside className="advisor-sidebar">
        <div className="sidebar-brand">ADVISOR MODE</div>
        <a href="/advisor/projects" className="menu-item active">โครงการที่ดูแล</a>
        <a href="/login" className="menu-item">ออกจากระบบ</a>
      </aside>
      <main className="advisor-main">
        <h1>โครงการที่ได้รับมอบหมาย</h1>
        {projects.map(p => (
          <div key={p.id} className="project-item">
            <div>
              <h3 style={{margin: 0}}>{p.title}</h3>
              <p style={{color: '#64748b', fontSize: '0.9rem'}}>{p.company}</p>
            </div>
            <button className="btn-orange" onClick={() => window.location.href=`/advisor/projects/${p.id}/students`}>
              ดูรายละเอียด
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}