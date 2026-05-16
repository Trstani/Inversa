# Frontend-Backend Connection Guide

**Date**: May 15, 2026
**Status**: ✅ READY TO CONNECT
**Purpose**: Connect frontend and backend

---

## 🔗 Connection Architecture

```
Frontend (http://localhost:5173)
    ↓ HTTP Requests
Backend (http://localhost:5000)
    ↓ SQL Queries
Supabase PostgreSQL
```

---

## ✅ Setup Checklist

### Backend Setup
- [x] Backend server configured (backend/server.js)
- [x] All routes imported (8 route files)
- [x] Database connection configured (backend/config/database.js)
- [x] Environment variables set (backend/.env)
- [x] CORS enabled for frontend
- [x] JWT middleware ready

### Frontend Setup
- [x] API client created (src/api/client.js)
- [x] Environment variables set (.env)
- [x] AuthContext updated
- [x] Components updated to use API client
- [x] 5 components already integrated

---

## 🚀 How to Connect

### Step 1: Start Backend

```powershell
# Navigate to backend folder
cd backend

# Install dependencies (if not done)
npm install

# Start backend server
npm run dev
```

**Expected Output**:
```
✅ Backend running on 5000
```

### Step 2: Start Frontend

```powershell
# In another terminal, navigate to root
cd ..

# Install dependencies (if not done)
npm install

# Start frontend dev server
npm run dev
```

**Expected Output**:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 3: Test Connection

Open browser and go to: `http://localhost:5173`

**Test Steps**:
1. Open browser console (F12)
2. Try to login with test user
3. Check console for API calls
4. Verify no CORS errors

---

## 🧪 Test Endpoints

### Health Check
```
GET http://localhost:5000/api/health
Expected: { "status": "OK" }
```

### Database Test
```
GET http://localhost:5000/api/test-db
Expected: { "success": true, "data": { "now": "2026-05-15T..." } }
```

### Debug Users
```
GET http://localhost:5000/api/debug-users
Expected: { "success": true, "data": [...users] }
```

---

## 📋 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=INVERSA
VITE_APP_VERSION=2.0.0
VITE_ENABLE_DEBUG=true
```

### Backend (backend/.env)
```
DATABASE_URL=postgresql://...
DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.pcmxbqeaocatcfyrlczt
DB_PASSWORD=Binusian2026
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

---

## 🔐 CORS Configuration

Backend CORS is configured to accept requests from:
- `http://localhost:5173` (development)
- Can be changed in `backend/server.js`

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

---

## 📊 API Routes (47 endpoints)

### Auth Routes (2)
```
POST   /api/auth/register
POST   /api/auth/login
```

### User Routes (8)
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

### Project Routes (10)
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

### Chapter Routes (8)
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

### Section Routes (6)
```
GET    /api/sections
GET    /api/sections/:id
POST   /api/sections
PUT    /api/sections/:id
DELETE /api/sections/:id
GET    /api/sections?chapterId=:id
```

### Team Routes (13)
```
GET    /api/teams
GET    /api/teams/:id
GET    /api/teams/user/:userId
POST   /api/teams
PUT    /api/teams/:id
DELETE /api/teams/:id
GET    /api/teams/:id/members
POST   /api/teams/:id/members
DELETE /api/teams/:id/members/:userId
POST   /api/teams/:id/request-join
POST   /api/teams/:id/approve-member
POST   /api/teams/:id/reject-member
GET    /api/teams/:id/pending-requests
GET    /api/teams/:id/projects
```

### Brainstorm Routes (13)
```
GET    /api/brainstorm/:projectId
GET    /api/brainstorm/:projectId/ideas
POST   /api/brainstorm/:projectId/ideas
DELETE /api/brainstorm/:projectId/ideas/:ideaId
POST   /api/brainstorm/:projectId/ideas/:ideaId/vote
DELETE /api/brainstorm/:projectId/ideas/:ideaId/vote
GET    /api/brainstorm/:projectId/tasks
POST   /api/brainstorm/:projectId/tasks
PUT    /api/brainstorm/:projectId/tasks/:taskId
DELETE /api/brainstorm/:projectId/tasks/:taskId
GET    /api/brainstorm/:projectId/ideas/:ideaId/comments
POST   /api/brainstorm/:projectId/ideas/:ideaId/comments
DELETE /api/brainstorm/:projectId/ideas/:ideaId/comments/:commentId
```

### Collaboration Routes (7)
```
GET    /api/collaboration/requests
GET    /api/collaboration/project/:projectId
GET    /api/collaboration/user/:userId
POST   /api/collaboration/requests
PUT    /api/collaboration/requests/:id
DELETE /api/collaboration/requests/:id
POST   /api/collaboration/requests/:id/approve
POST   /api/collaboration/requests/:id/reject
```

### Reading History Routes (6)
```
GET    /api/reading-history
GET    /api/reading-history/continue
GET    /api/reading-history/project/:projectId
POST   /api/reading-history
DELETE /api/reading-history/:projectId/:chapterId
DELETE /api/reading-history
```

### Reports Routes (6)
```
GET    /api/reports
GET    /api/reports/:id
GET    /api/reports/project/:projectId
POST   /api/reports/project/:projectId
PUT    /api/reports/:id
DELETE /api/reports/:id
```

---

## 🧪 Test API Calls

### Test 1: Health Check
```javascript
// In browser console
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Test 2: Get Users
```javascript
fetch('http://localhost:5000/api/debug-users')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Test 3: Login
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@mail.com',
    password: 'password123'
  })
})
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution**: Check CORS configuration in backend/server.js
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

### Issue: Connection Refused
**Solution**: Make sure backend is running on port 5000
```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000
```

### Issue: Database Connection Error
**Solution**: Check backend/.env file
```
DATABASE_URL=postgresql://...
```

### Issue: JWT Error
**Solution**: Make sure JWT_SECRET is set in backend/.env
```
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

---

## 📝 API Client Usage

### In Frontend Components

```javascript
import { apiClient, setAuthToken } from '@/api/client';

// Login
const response = await apiClient.auth.login({ email, password });
if (response.success) {
  setAuthToken(response.token);
}

// Get Projects
const projectsResponse = await apiClient.projects.getAll();
const projects = projectsResponse.data;

// Create Project
const createResponse = await apiClient.projects.create({
  title: 'My Project',
  description: 'Description',
  category_id: '1',
  genre_id: '1'
});
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Health check returns OK
- [ ] Database test returns current time
- [ ] Debug users returns user list
- [ ] Login works
- [ ] No CORS errors in console
- [ ] API calls work from frontend
- [ ] Components display data correctly

---

## 🎯 Next Steps

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `npm run dev`
3. **Test Connection**: Open http://localhost:5173
4. **Test Features**: Try login, create project, etc.
5. **Check Console**: Verify no errors
6. **Continue Phase 4**: Update remaining components

---

## 📞 Support

### Check Logs
- **Backend**: Terminal where backend is running
- **Frontend**: Browser console (F12)
- **Database**: Supabase dashboard

### Common Issues
- CORS error → Check CORS config
- Connection refused → Check if backend is running
- Database error → Check .env file
- JWT error → Check JWT_SECRET

---

**Status**: ✅ READY TO CONNECT
**Next Action**: Start backend and frontend servers

