# Cooperative Education Management System

Cooperative Education Management System is a **Full-stack web application** for managing cooperative education workflows among students, advisors, and HR (companies). The system features a React frontend and a NestJS backend, implementing JWT-based authentication, role-based access control (RBAC), and activity logging with Supabase (PostgreSQL).

## Tech Stack

### Frontend 
- **Build Tool:** Vite
- **Library:** React
- **Language:** TypeScript (.tsx)
- **Styling:** CSS
- **API Integration:** Axios

### Backend 
- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL (Hosted on Supabase)
- **ORM:** Sequelize
- **Security:** JWT (JSON Web Token)
- **Code Quality:** SonarQube

---

## System Architecture

- `frontend` handles UI, routing, local state, and API requests with attached JWT
- `backend/modules` encapsulates related features and manages dependencies
- `backend/controllers` receives HTTP requests, validates DTOs, and returns JSON responses
- `backend/services` contains business rules such as project applications, approvals, and RBAC enforcement
- `backend/guards` handles JWT verification and backend permission checks
- `Supabase (PostgreSQL)` stores users, role-specific profiles (Students, Advisor, HR, Company, ProjectManager), projects, applications, reports, and activity logs

```mermaid
flowchart LR
    %% Custom styles to match the dark/flat minimalist theme
    classDef default fill:#1e1e1e,stroke:#555,stroke-width:1px,color:#fff,rx:2,ry:2;
    classDef label fill:#333,stroke:none,color:#fff;

    A["React Frontend"] -- "HTTPS / JSON" --> B["NestJS API"]
    B --> C["Guards / Middleware Layer"]
    
    C --> D["Controllers Layer"]
    C --> E["JWT Verification"]
    
    D --> F["Service Layer"]
    
    F --> G["Models Layer (Sequelize)"]
    F --> H["RBAC & Business Rules"]
    
    G --> I["Supabase (PostgreSQL)"]
