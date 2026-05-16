# Test Frontend-Backend Connection

**Date**: May 15, 2026
**Status**: ✅ BACKEND RUNNING ON PORT 5000

---

## ✅ Backend Status

```
✅ Backend running on 5000
✅ All routes loaded
✅ Database connection ready
✅ CORS enabled for http://localhost:5173
```

---

## 🚀 Next: Start Frontend

### Command
```powershell
npm run dev
```

### Expected Output
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## 🧪 Test Steps (After Frontend Starts)

### 1. Open Browser
- Go to: http://localhost:5173

### 2. Open Console
- Press: F12
- Go to: Console tab

### 3. Test API Call
```javascript
// Paste in console and press Enter
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Connection OK:', d))
  .catch(e => console.error('❌ Error:', e))
```

### 4. Expected Result
```
✅ Connection OK: { status: 'OK' }
```

---

## 📋 Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Browser console shows no CORS errors
- [ ] Health check returns OK
- [ ] Can login with test user
- [ ] Can see projects list
- [ ] Can create new project
- [ ] Can view project details

---

## 🔗 Connection Flow

```
Browser (http://localhost:5173)
    ↓ HTTP Request
Backend (http://localhost:5000)
    ↓ SQL Query
Supabase PostgreSQL
    ↓ Result
Backend (JSON Response)
    ↓ HTTP Response
Browser (Display Data)
```

---

## 📝 Test Users (Already in Database)

```
Email: test@mail.com
Password: password123

Email: lena@mail.com
Password: password123

Email: udin@mail.com
Password: password123
```

---

## 🎯 What to Test

### 1. Authentication
- [ ] Login with test@mail.com
- [ ] See dashboard
- [ ] Logout

### 2. Projects
- [ ] View all projects
- [ ] Create new project
- [ ] View project details
- [ ] Like/unlike project

### 3. Teams
- [ ] View teams
- [ ] Create team
- [ ] Join team
- [ ] View team members

### 4. Chapters
- [ ] View chapters
- [ ] Create chapter
- [ ] Edit chapter
- [ ] Publish chapter

### 5. Brainstorm
- [ ] Add ideas
- [ ] Add tasks
- [ ] Vote on ideas
- [ ] Add comments

---

## 🐛 Troubleshooting

### Issue: CORS Error
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution**: 
- Check backend CORS config
- Make sure FRONTEND_URL=http://localhost:5173 in backend/.env
- Restart backend

### Issue: Connection Refused
```
Failed to fetch
```

**Solution**:
- Make sure backend is running on port 5000
- Check: `netstat -ano | findstr :5000`
- Restart backend: `npm run dev` in backend folder

### Issue: Database Error
```
Error: connect ECONNREFUSED
```

**Solution**:
- Check DATABASE_URL in backend/.env
- Make sure Supabase is accessible
- Check internet connection

---

## 📊 API Endpoints to Test

### Health Check
```
GET http://localhost:5000/api/health
```

### Debug Users
```
GET http://localhost:5000/api/debug-users
```

### Login
```
POST http://localhost:5000/api/auth/login
Body: { "email": "test@mail.com", "password": "password123" }
```

### Get Projects
```
GET http://localhost:5000/api/projects
```

### Create Project
```
POST http://localhost:5000/api/projects
Headers: { "Authorization": "Bearer <token>" }
Body: { "title": "Test", "description": "Test", "category_id": "1", "genre_id": "1" }
```

---

## ✅ Success Criteria

Connection is successful when:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ No CORS errors in console
- ✅ Health check returns OK
- ✅ Can login
- ✅ Can see data from database
- ✅ Can create/update/delete data

---

**Status**: ✅ BACKEND READY
**Next Action**: Start frontend with `npm run dev`

