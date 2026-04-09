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
- **Security:** JWT (JSON Web Token), bcrypt
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
```

## Security & Authentication Flow

The system implements a secure, stateless authentication mechanism tailored for multi-role access (Students, Advisors, HR, Company, ProjectManager):

1. **Registration:** Account creation is strictly restricted to `HR` and `Company` roles to ensure system integrity and prevent unauthorized user generation. The `backend` enforces security policies, hashes credentials via `bcrypt`, and stores them securely in `Supabase`.
2. **Authentication:** All users (Students, Advisors, PM, etc.) must log in with authorized credentials created or approved by the system. Upon success, the API issues:
   - `accessToken`: Delivered in the JSON response payload.
   - `refresh_token`: Stored inside an `HttpOnly` cookie to mitigate XSS (Cross-Site Scripting) attacks.
3. **Request Authorization:** The `React frontend` manages the access token state and attaches it via the `Authorization: Bearer <token>` header for every protected API request.
4. **Access Control:** Every incoming request is strictly intercepted and validated by NestJS guards:
   - `JwtAuthGuard`: Verifies the token's signature, integrity, and expiration status.
   - `RolesGuard`: Cross-checks the user's role against specific endpoint permissions (e.g., only students are permitted to submit reports).
5. **Exception Handling:** Any request with a missing, tampered, or unauthorized token is instantly rejected with a `401 Unauthorized` or `403 Forbidden` response.

## Authorization Design

The system uses JWT claims plus backend permission checks. Role checks are not trusted from the frontend alone.

### Roles
- `HR`
- `STUDENT`
- `ADVISOR`
- `ADMIN`

### Role Journey
- `HR` lands on project management pages: add project, edit project, and deletion requests
- `STUDENT` lands on internship pages: project applications and progress tracking
- `ADVISOR` lands on management pages: project/student approvals and status updates
- `ADMIN` lands on system control pages: user management, role updates, and deletion approval

### Backend Authorization
- All protected routes are grouped under `JwtAuthGuard`
- JWT signature and token type are verified by the backend
- Permissions are checked by `RolesGuard`
- Database access is restricted by role-specific queries

### Permission Matrix

| Feature | Company | Students | Advisor | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Add/Edit Projects** | Yes | No | No | No |
| **Request Project Deletion** | Yes | No | No | No |
| **Apply/Reject Projects** | No | Yes | No | No |
| **Submit Progress** | No | Yes | No | No |
| **Approve/Reject Projects** | No | No | Yes | No |
| **Approve/Reject Students** | No | No | Yes | No |
| **Change Student Status** | No | No | Yes | No |
| **Manage Users (Add/Del)** | No | No | No | Yes |
| **Reset Password / Edit Role** | No | No | No | Yes |
| **Approve Deletion Request** | No | No | No | Yes |
| **Edit Profile** | Yes | No | No | No |
| **Login** | Yes | Yes | Yes | Yes |

### Database Access Control
- **Same table, different permission:**
    - `students` reads only their own applications with `WHERE student_id = ?`
    - `advisor` and `admin` can view team/system summaries using all-access queries
- **Different table by role:**
    - only `admin` can access system logs from the `activity_logs` table
    - `company` and `hr` access specific records from `company` and `hr` tables

---
