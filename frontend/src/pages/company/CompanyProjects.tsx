import './Company.css';

export default function CompanyProjects() {
    const data = [
        { id: 1, name: "TTB tech & data Internship 2026", role: "UX/UI", slots: 2, status: "APPROVED" },
        { id: 2, name: "TTB tech & data Internship 2026", role: "Software Engineering", slots: 1, status: "PENDING" }
    ];

    return (
        <div className="company-layout">
            <nav className="company-navbar">
                <div className="nav-brand">CO-OP COMPANY</div>
                <div className="nav-menu">
                    <a href="/company/projects" className="nav-item active">โครงการ</a>
                    <a href="/company/profile" className="nav-item">โปรไฟล์</a>
                    <button className="btn-logout" onClick={() => window.location.href = '/login'}>Logout</button>
                </div>
            </nav>

            <main className="company-main">
                <div className="page-header">
                    <h1>จัดการโครงการ</h1>
                    <button className="btn-primary" onClick={() => window.location.href = '/company/projects/create'}>
                        + สร้างโครงการใหม่
                    </button>
                </div>

                <div className="card">
                    <table className="project-table">
                        <thead>
                            <tr>
                                <th>ชื่อโครงการ</th>
                                <th>ตำแหน่ง</th>
                                <th>จำนวนรับ</th>
                                <th>สถานะ</th>
                                <th style={{ textAlign: 'center' }}>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id}>
                                    <td style={{ textAlign: 'left' }}>
                                        <strong>{item.name}</strong>
                                    </td>

                                    <td style={{ color: 'var(--company-orange)', fontWeight: 600 }}>
                                        {item.role}
                                    </td>

                                    <td style={{ paddingLeft: '35px', fontWeight: 600}}>
                                        {item.slots}
                                    </td>

                                    <td style={{ paddingLeft: '5px' }}>
                                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                                            {item.status}
                                        </span>
                                    </td>

                                    <td style={{ textAlign: 'center' }}>
                                        <button className="btn-edit-outline">แก้ไขข้อมูล</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}