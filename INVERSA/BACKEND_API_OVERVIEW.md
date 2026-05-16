# Backend API Overview

Dokumentasi lengkap backend INVERSA API yang baru dengan Supabase PostgreSQL.

## 📍 Lokasi Backend

```
INVERSA/
├── backend-api/              ← NEW BACKEND (Express.js + Supabase)
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── [Documentation files]
│
├── backend/                  ← OLD BACKEND (for reference)
├── src/                      ← FRONTEND
└── [Other files]
```

## 🎯 Tujuan Backend Baru

Menggantikan sistem localStorage yang terbatas dengan backend profesional yang:
- ✅ Menggunakan database PostgreSQL (Supabase)
- ✅ Mendukung multi-user dengan authentication
- ✅ Menyediakan unlimited storage
- ✅ Siap untuk production deployment
- ✅ Scalable dan maintainable

## 🚀 Quick Start

### 1. Setup Backend
```bash
cd backend-api
npm install
```

### 2. Configure Database
- Login ke Supabase
- Copy SQL dari DATABASE_SETUP.md
- Run di SQL Editor
- Verify tables created

### 3. Configure Environment
```bash
# Update .env dengan Supabase credentials
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### 4. Run Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## 📚 Documentation Files

### Di Folder backend-api/

| File | Deskripsi |
|------|-----------|
| **README.md** | Project overview & complete API documentation |
| **DATABASE_SETUP.md** | Step-by-step database setup guide |
| **DEPLOYMENT.md** | Render deployment guide |
| **FRONTEND_INTEGRATION.md** | Frontend integration guide dengan code examples |
| **STRUCTURE.md** | Backend architecture & folder structure |
| **SETUP_SUMMARY.md** | Setup summary & checklist |
| **QUICK_REFERENCE.md** | Quick reference untuk common tasks |

### Di Root Folder

| File | Deskripsi |
|------|-----------|
| **BACKEND_API_OVERVIEW.md** | This file - overview lengkap |
| **MIGRATION_GUIDE.md** | Panduan migrasi dari old backend |

## 🏗️ Architecture

### Layers

```
Frontend (React)
    ↓
API Client (src/api/client.js)
    ↓
Express Server (backend-api/server.js)
    ↓
Routes & Middleware
    ↓
Database (Supabase PostgreSQL)
```

### Components

```
backend-api/
├── config/database.js        → Database connection & pooling
├── middleware/auth.js        → JWT authentication
├── routes/                   → API endpoints
│   ├── auth.js              → Register & Login
│   ├── users.js             → User management
│   ├── projects.js          → Project CRUD
│   ├── chapters.js          → Chapter management
│   ├── sections.js          → Section management
│   ├── teams.js             → Team management
│   ├── brainstorm.js        → Brainstorm features
│   ├── collaboration.js     → Collaboration
│   └── readingHistory.js    → Reading history
└── server.js                → Main Express app
```

## 🔐 Security

### Authentication
- JWT tokens dengan expiration
- Password hashing dengan bcryptjs
- Role-based access control

### Database
- SSL connection ke Supabase
- Connection pooling
- Foreign key constraints
- Parameterized queries (SQL injection prevention)

### API
- CORS configuration
- Helmet security headers
- Input validation

## 📊 Database

### 18 Tables
- users, projects, chapters, sections
- teams, team_members, team_projects
- user_follows, project_likes, project_collaborators
- brainstorm_ideas, brainstorm_votes, brainstorm_tasks
- collaboration_requests, reading_history

### Relationships
- Foreign keys untuk data integrity
- Cascade delete untuk cleanup
- Unique constraints untuk prevent duplicates
- Indexes untuk query optimization

## 🔄 API Endpoints

### Total: 60+ Endpoints

**Authentication** (2)
- POST /auth/register
- POST /auth/login

**Users** (8)
- GET /users, GET /users/:id, PUT /users/:id, DELETE /users/:id
- POST /users/follow/:id, DELETE /users/follow/:id
- GET /users/:id/followers, GET /users/:id/following

**Projects** (8)
- GET /projects, GET /projects/:id, POST /projects, PUT /projects/:id, DELETE /projects/:id
- POST /projects/:id/views, POST /projects/:id/likes, DELETE /projects/:id/likes

**Chapters** (7)
- GET /chapters, GET /chapters/:id, POST /chapters, PUT /chapters/:id, DELETE /chapters/:id
- POST /chapters/:id/publish, POST /chapters/:id/unpublish

**Sections** (5)
- GET /sections, GET /sections/:id, POST /sections, PUT /sections/:id, DELETE /sections/:id

**Teams** (9)
- GET /teams, GET /teams/:id, GET /teams/user/:userId, POST /teams, PUT /teams/:id, DELETE /teams/:id
- GET /teams/:id/members, POST /teams/:id/members, DELETE /teams/:id/members/:userId

**Brainstorm** (8)
- GET /brainstorm/:projectId/ideas, POST /brainstorm/:projectId/ideas, DELETE /brainstorm/:projectId/ideas/:ideaId
- POST /brainstorm/:projectId/ideas/:ideaId/vote, DELETE /brainstorm/:projectId/ideas/:ideaId/vote
- GET /brainstorm/:projectId/tasks, POST /brainstorm/:projectId/tasks, PUT /brainstorm/:projectId/tasks/:taskId

**Collaboration** (7)
- GET /collaboration/requests, GET /collaboration/project/:projectId, GET /collaboration/user/:userId
- POST /collaboration/requests, PUT /collaboration/requests/:id, DELETE /collaboration/requests/:id
- POST /collaboration/requests/:id/approve, POST /collaboration/requests/:id/reject

**Reading History** (6)
- GET /reading-history, GET /reading-history/continue, GET /reading-history/project/:projectId
- POST /reading-history, DELETE /reading-history/:projectId/:chapterId, DELETE /reading-history

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime
- **PostgreSQL** - Database (via Supabase)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Deployment
- **Render** - Hosting
- **Supabase** - Database hosting
- **GitHub** - Version control

### Development
- **nodemon** - Auto-reload
- **dotenv** - Environment variables

## 📈 Performance

### Optimizations
- Connection pooling
- Database indexes
- Efficient queries
- Stateless design

### Scalability
- Horizontal scaling (multiple instances)
- Database connection pooling
- Stateless API design
- CDN-ready

## 🚀 Deployment

### Development
```bash
npm run dev
# Server at http://localhost:5000
```

### Production (Render)
```bash
npm start
# Server at https://inversa-backend-api.onrender.com
```

### Environment Variables
```env
# Development
DATABASE_URL=postgresql://...
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret
FRONTEND_URL=http://localhost:5173

# Production
DATABASE_URL=postgresql://...
PORT=5000
NODE_ENV=production
JWT_SECRET=<strong-secret>
FRONTEND_URL=https://your-domain.com
```

## 🧪 Testing

### Manual Testing
- Use Postman atau Insomnia
- Test authentication endpoints
- Test CRUD operations
- Test error handling

### Automated Testing (Optional)
```bash
npm test
```

## 📝 Development Workflow

### 1. Local Development
```bash
cd backend-api
npm install
npm run dev
```

### 2. Test Endpoints
```bash
# Use Postman atau curl
curl http://localhost:5000/api/health
```

### 3. Make Changes
- Edit route files
- Test locally
- Commit changes

### 4. Deploy
```bash
git push origin main
# Render automatically deploys
```

## 🔄 Frontend Integration

### Update API URL
```javascript
// src/api/client.js
const API_BASE_URL = 'http://localhost:5000/api';
```

### Use API Client
```javascript
import { apiClient } from '@/api/client';

// Get projects
const projects = await apiClient.projects.getAll();

// Create project
const newProject = await apiClient.projects.create({ title: 'My Project' });

// Update project
await apiClient.projects.update(id, { title: 'Updated' });

// Delete project
await apiClient.projects.delete(id);
```

## 🐛 Troubleshooting

### Backend Issues
- Check if server running: `npm run dev`
- Check port: `PORT=5000`
- Check logs in terminal
- Test health endpoint: `curl http://localhost:5000/api/health`

### Database Issues
- Check DATABASE_URL in .env
- Verify Supabase credentials
- Test connection: `curl http://localhost:5000/api/test-db`
- Check Supabase dashboard

### Frontend Issues
- Check API URL in client.js
- Check browser console for errors
- Check network tab in DevTools
- Verify CORS configuration

## 📊 Monitoring

### Development
- Check terminal logs
- Use browser DevTools
- Test endpoints with Postman

### Production
- Monitor Render logs
- Setup error tracking (optional)
- Monitor database performance
- Check API response times

## 🎯 Next Steps

### Immediate
1. ✅ Setup database di Supabase
2. ✅ Configure environment variables
3. ✅ Run development server
4. ✅ Test API endpoints

### Short Term
1. Update frontend API URL
2. Test frontend-backend integration
3. Deploy to Render
4. Test production environment

### Long Term
1. Add automated tests
2. Implement caching
3. Add monitoring/logging
4. Performance optimization
5. Security audit

## 📞 Support Resources

- **Express.js**: https://expressjs.com/
- **Supabase**: https://supabase.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs/
- **JWT**: https://jwt.io/
- **Render**: https://render.com/docs

## ✅ Checklist

### Setup
- [ ] Backend folder created
- [ ] Dependencies installed
- [ ] Database setup complete
- [ ] Environment variables configured
- [ ] Server running locally

### Testing
- [ ] Health endpoint working
- [ ] Database connection working
- [ ] Authentication working
- [ ] CRUD operations working
- [ ] Error handling working

### Deployment
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Production URL working

### Integration
- [ ] Frontend API URL updated
- [ ] Frontend-backend connected
- [ ] All endpoints tested
- [ ] Error handling working
- [ ] Ready for production

## 🎉 Summary

Backend INVERSA API sudah siap dengan:
- ✅ Complete REST API (60+ endpoints)
- ✅ Supabase PostgreSQL integration
- ✅ JWT authentication
- ✅ Comprehensive documentation
- ✅ Production-ready code
- ✅ Deployment guide

**Tinggal setup database, configure environment, dan deploy!** 🚀

## 📖 Documentation Index

1. **BACKEND_API_OVERVIEW.md** (this file) - Overview lengkap
2. **backend-api/README.md** - Full API documentation
3. **backend-api/DATABASE_SETUP.md** - Database setup
4. **backend-api/DEPLOYMENT.md** - Deployment guide
5. **backend-api/FRONTEND_INTEGRATION.md** - Frontend integration
6. **backend-api/STRUCTURE.md** - Architecture overview
7. **backend-api/SETUP_SUMMARY.md** - Setup summary
8. **backend-api/QUICK_REFERENCE.md** - Quick reference
9. **MIGRATION_GUIDE.md** - Migration dari old backend

Semua dokumentasi tersedia dan siap digunakan! 📚
