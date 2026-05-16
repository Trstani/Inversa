# INVERSA Architecture Overview

**Date**: May 15, 2026
**Status**: ✅ PRODUCTION READY
**Version**: 2.0 (Supabase + Backend Services)

---

## 🏗️ System Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Components (30+)                                    │  │
│  │  - UserDashboard, ProjectDetail, ChapterReader, etc. │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Client (src/api/client.js)                      │  │
│  │  - 50+ methods                                       │  │
│  │  - JWT token management                             │  │
│  │  - Error handling                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes (8 files, 47 endpoints)                      │  │
│  │  - /auth, /users, /projects, /chapters, etc.        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services (9 files, 93 functions)                    │  │
│  │  - userService, projectService, teamService, etc.   │  │
│  │  - Business logic                                    │  │
│  │  - Authorization checks                             │  │
│  │  - Data validation                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Database Config (backend/config/database.js)        │  │
│  │  - Supabase PostgreSQL connection                    │  │
│  │  - Connection pooling                                │  │
│  │  - SSL configuration                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ SQL
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (Supabase PostgreSQL)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables (15 total)                                   │  │
│  │  - users, projects, chapters, sections, teams, etc.  │  │
│  │  - Real-time sync                                    │  │
│  │  - Automatic backups                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

### Frontend (src/)
```
src/
├── api/
│   └── client.js                    # API client (50+ methods)
├── utils/
│   └── apiTransformer.js            # Field name conversion
├── context/
│   ├── AuthContext.jsx              # Auth state management
│   └── ThemeContext.jsx             # Theme state management
├── components/
│   ├── CardProject.jsx              # Project card component
│   ├── ChapterReader.jsx            # Chapter reading
│   ├── Editor/                      # Editor components
│   ├── Brainstorm/                  # Brainstorm components
│   └── ... (30+ components)
├── InitiatorFolder/
│   ├── UserDashboard.jsx            # User dashboard
│   ├── TeamDetailPage.jsx           # Team detail page
│   ├── EditorPage.jsx               # Editor page
│   └── ... (other pages)
├── MainPage/
│   ├── Home.jsx                     # Home page
│   ├── ProjectDetail.jsx            # Project detail page
│   └── ... (other pages)
├── routes/
│   ├── AppRoutes.jsx                # Route configuration
│   └── PublicRoute.jsx              # Public route guard
└── ... (other files)
```

### Backend (backend/)
```
backend/
├── services/
│   ├── userService.js               # User operations (11 functions)
│   ├── projectService.js            # Project operations (13 functions)
│   ├── chapterService.js            # Chapter operations (11 functions)
│   ├── teamService.js               # Team operations (18 functions)
│   ├── brainstormService.js         # Brainstorm operations (13 functions)
│   ├── sectionService.js            # Section operations (7 functions)
│   ├── collaborationService.js      # Collaboration operations (8 functions)
│   ├── readingHistoryService.js     # Reading history operations (6 functions)
│   ├── reportService.js             # Report operations (6 functions)
│   └── index.js                     # Service exports
├── routes/
│   ├── auth.js                      # Authentication endpoints
│   ├── users.js                     # User endpoints
│   ├── projects.js                  # Project endpoints
│   ├── chapters.js                  # Chapter endpoints
│   ├── sections.js                  # Section endpoints
│   ├── teams.js                     # Team endpoints
│   ├── brainstorm.js                # Brainstorm endpoints
│   └── collaboration.js             # Collaboration endpoints
├── middleware/
│   └── auth.js                      # JWT authentication middleware
├── config/
│   └── database.js                  # Supabase connection
├── server.js                        # Express server setup
├── package.json                     # Dependencies
└── .env                             # Environment variables
```

---

## 🔄 Data Flow Examples

### Example 1: Create Project

```
1. Frontend (UserDashboard.jsx)
   └─ User clicks "Create Project"
   └─ Calls: apiClient.projects.create(data)

2. API Client (src/api/client.js)
   └─ Makes POST request to /api/projects
   └─ Includes JWT token in header

3. Backend Route (backend/routes/projects.js)
   └─ Receives POST /api/projects
   └─ Validates JWT token
   └─ Calls: projectService.createProject()

4. Backend Service (backend/services/projectService.js)
   └─ Validates input data
   └─ Checks authorization
   └─ Executes SQL: INSERT INTO projects ...

5. Database (Supabase PostgreSQL)
   └─ Inserts new project row
   └─ Returns created project

6. Response Flow (reverse)
   └─ Service returns { success: true, project: {...} }
   └─ Route returns JSON response
   └─ API Client receives response
   └─ Component updates state
   └─ UI re-renders with new project
```

### Example 2: Read Project

```
1. Frontend (ProjectDetail.jsx)
   └─ Component mounts
   └─ Calls: apiClient.projects.getById(projectId)

2. API Client (src/api/client.js)
   └─ Makes GET request to /api/projects/:id
   └─ Includes JWT token in header

3. Backend Route (backend/routes/projects.js)
   └─ Receives GET /api/projects/:id
   └─ Validates JWT token
   └─ Calls: projectService.getProjectById()

4. Backend Service (backend/services/projectService.js)
   └─ Executes SQL: SELECT * FROM projects WHERE id = ?
   └─ Returns project data

5. Response Flow (reverse)
   └─ Service returns { success: true, project: {...} }
   └─ Route returns JSON response
   └─ API Client receives response
   └─ Component updates state
   └─ UI displays project details
```

---

## 🔐 Security Architecture

### Authentication Flow

```
1. User Login
   └─ Frontend: apiClient.auth.login({ email, password })
   └─ Backend: Validates credentials
   └─ Backend: Generates JWT token
   └─ Frontend: Stores token in localStorage
   └─ Frontend: Sets Authorization header

2. Authenticated Request
   └─ Frontend: apiClient.method() with token
   └─ Backend: Middleware checks JWT
   └─ Backend: Extracts user ID from token
   └─ Backend: Checks authorization
   └─ Backend: Executes operation

3. Token Expiration
   └─ Frontend: Detects 401 response
   └─ Frontend: Clears token
   └─ Frontend: Redirects to login
```

### Authorization Checks

```
Project Operations:
├─ Create: Any authenticated user
├─ Read: Any user (public projects)
├─ Update: Project initiator only
├─ Delete: Project initiator only

Team Operations:
├─ Create: Any authenticated user
├─ Read: Team members only
├─ Update: Team owner only
├─ Delete: Team owner only

Chapter Operations:
├─ Create: Project initiator or team member
├─ Read: Any user (published chapters)
├─ Update: Chapter author or project initiator
├─ Delete: Chapter author or project initiator
```

---

## 📊 Database Schema

### Core Tables (15 total)

```
users
├─ id (PK)
├─ name
├─ email (UNIQUE)
├─ password_hash
├─ avatar
├─ role
├─ created_at
└─ updated_at

projects
├─ id (PK)
├─ title
├─ description
├─ category_id (FK)
├─ genre_id (FK)
├─ initiator_id (FK → users)
├─ team_id (FK → teams)
├─ background_image
├─ likes
├─ views
├─ is_team_project
├─ hidden
├─ has_published_chapters
├─ created_at
├─ updated_at
└─ deleted_at (soft delete)

chapters
├─ id (PK)
├─ project_id (FK → projects)
├─ title
├─ description
├─ chapter_number
├─ is_published
├─ is_locked
├─ created_at
├─ updated_at
└─ deleted_at (soft delete)

sections
├─ id (PK)
├─ chapter_id (FK → chapters)
├─ section_type (text/image)
├─ content
├─ order
├─ created_at
├─ updated_at
└─ deleted_at (soft delete)

teams
├─ id (PK)
├─ name
├─ description
├─ background_image
├─ created_by (FK → users)
├─ created_at
├─ updated_at
└─ deleted_at (soft delete)

team_members
├─ id (PK)
├─ team_id (FK → teams)
├─ user_id (FK → users)
├─ role
├─ status (pending/approved)
├─ joined_at
└─ deleted_at (soft delete)

... (9 more tables for brainstorm, collaboration, etc.)
```

---

## 🚀 API Endpoints (47 total)

### Auth (2 endpoints)
```
POST   /api/auth/register
POST   /api/auth/login
```

### Users (8 endpoints)
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
POST   /api/users/follow/:id
DELETE /api/users/follow/:id
GET    /api/users/:id/followers
GET    /api/users/:id/following
```

### Projects (10 endpoints)
```
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/views
POST   /api/projects/:id/likes
DELETE /api/projects/:id/likes
POST   /api/projects/:id/hide
POST   /api/projects/:id/unhide
```

### Chapters (8 endpoints)
```
GET    /api/chapters
GET    /api/chapters/:id
POST   /api/chapters
PUT    /api/chapters/:id
DELETE /api/chapters/:id
POST   /api/chapters/:id/publish
POST   /api/chapters/:id/unpublish
POST   /api/chapters/:id/lock
```

### ... (and more for sections, teams, brainstorm, collaboration, etc.)
```
Total: 47 endpoints
```

---

## 🔄 Data Synchronization

### Real-time Updates

```
User A makes change
    ↓
Frontend sends API request
    ↓
Backend updates Supabase
    ↓
Supabase broadcasts change
    ↓
User B's frontend receives update
    ↓
User B's UI updates automatically
```

### Consistency Guarantees

- ✅ Single source of truth (Supabase)
- ✅ ACID transactions
- ✅ Foreign key constraints
- ✅ Automatic timestamps
- ✅ Soft deletes (data recovery)

---

## 📈 Performance Considerations

### Optimization Strategies

1. **Connection Pooling**
   - Reuses database connections
   - Reduces connection overhead
   - Improves response time

2. **Query Optimization**
   - Indexes on frequently queried columns
   - Efficient JOIN operations
   - Pagination for large datasets

3. **Caching**
   - Frontend caching (React state)
   - API response caching
   - Database query caching

4. **Pagination**
   - Limits data transfer
   - Improves UI responsiveness
   - Reduces memory usage

---

## 🛠️ Development Workflow

### Local Development

```
1. Start Backend
   npm run dev (in backend/)
   └─ Runs on http://localhost:5000

2. Start Frontend
   npm run dev (in root)
   └─ Runs on http://localhost:5173

3. Test Features
   └─ Open http://localhost:5173
   └─ Test login, create project, etc.

4. Check Logs
   └─ Backend logs in terminal
   └─ Frontend console in browser
   └─ Supabase logs in dashboard
```

### Deployment

```
1. Backend Deployment (Render)
   └─ Push to main branch
   └─ Render auto-deploys
   └─ Runs on render.com

2. Frontend Deployment (Vercel)
   └─ Push to main branch
   └─ Vercel auto-deploys
   └─ Runs on vercel.com

3. Database (Supabase)
   └─ Already hosted
   └─ No deployment needed
   └─ Automatic backups
```

---

## 📝 Key Principles

### 1. Separation of Concerns
- Frontend: UI and user interaction
- Backend: Business logic and data validation
- Database: Data storage and retrieval

### 2. Single Responsibility
- Each service handles one domain
- Each route handles one resource
- Each component handles one feature

### 3. DRY (Don't Repeat Yourself)
- Shared logic in services
- Reusable components
- Common utilities

### 4. Security First
- JWT authentication
- Authorization checks
- Input validation
- SQL injection prevention

### 5. Scalability
- Stateless backend
- Horizontal scaling ready
- Database connection pooling
- Efficient queries

---

## 🎯 Summary

**Architecture**: Frontend → API → Backend Services → Supabase PostgreSQL

**Benefits**:
- ✅ Clean separation of concerns
- ✅ Real-time data synchronization
- ✅ Strong security
- ✅ Scalable to millions of users
- ✅ Professional industry standard

**Status**: ✅ PRODUCTION READY

---

**Last Updated**: May 15, 2026
**Version**: 2.0
**Status**: COMPLETE

