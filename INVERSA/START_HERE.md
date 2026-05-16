# 🚀 START HERE - Backend INVERSA API

Selamat! Backend INVERSA API sudah siap. Ikuti panduan ini untuk memulai.

## 📍 Lokasi Backend

```
INVERSA/
└── backend-api/              ← Backend baru (Express.js + Supabase)
    ├── config/
    ├── middleware/
    ├── routes/
    ├── server.js
    ├── package.json
    ├── .env
    └── [Documentation]
```

## ⚡ Quick Start (5 Menit)

### 1. Setup Database (Supabase)
```bash
# 1. Login ke https://supabase.com
# 2. Buka project Anda
# 3. Buka SQL Editor
# 4. Copy semua SQL dari: backend-api/DATABASE_SETUP.md
# 5. Paste & Run
# 6. Verify tables created
```

### 2. Configure Environment
```bash
# Edit backend-api/.env
DATABASE_URL=postgresql://postgres.pcmxbqeaocatcfyrlczt:Binusian2026@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres
DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.pcmxbqeaocatcfyrlczt
DB_PASSWORD=Binusian2026
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173
```

### 3. Run Development Server
```bash
cd backend-api
npm install
npm run dev
```

Server akan berjalan di `http://localhost:5000`

### 4. Test API
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Response: {"status":"OK"}
```

✅ Backend siap!

## 📚 Documentation

### Essential Files
| File | Untuk |
|------|-------|
| **backend-api/README.md** | Full API documentation |
| **backend-api/QUICK_REFERENCE.md** | Common tasks & commands |
| **backend-api/DATABASE_SETUP.md** | Database setup |
| **backend-api/DEPLOYMENT.md** | Deploy ke Render |
| **backend-api/FRONTEND_INTEGRATION.md** | Integrate dengan frontend |

### Additional Files
| File | Untuk |
|------|-------|
| **BACKEND_API_OVERVIEW.md** | Overview lengkap |
| **MIGRATION_GUIDE.md** | Migrasi dari old backend |
| **BACKEND_COMPLETION_REPORT.md** | Completion report |

## 🔐 Authentication

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response akan berisi token:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```

### Use Token
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <token>"
```

## 📊 API Endpoints

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
const newProject = await apiClient.projects.create({
  title: 'My Project',
  description: 'Description'
});

// Update project
await apiClient.projects.update(id, { title: 'Updated' });

// Delete project
await apiClient.projects.delete(id);
```

## 🚀 Deployment (Render)

### 1. Push to GitHub
```bash
git add backend-api/
git commit -m "Add backend-api"
git push origin main
```

### 2. Create Render Service
1. Buka https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Select repository

### 3. Configure
- **Name**: inversa-backend-api
- **Environment**: Node
- **Build Command**: npm install
- **Start Command**: npm start
- **Root Directory**: backend-api

### 4. Set Environment Variables
```
DATABASE_URL=postgresql://...
PORT=5000
NODE_ENV=production
JWT_SECRET=<strong-secret-key>
FRONTEND_URL=https://your-domain.com
```

### 5. Deploy
Click "Create Web Service" dan tunggu deployment selesai.

Production URL: `https://inversa-backend-api.onrender.com`

## 🧪 Testing

### Using Postman
1. Download Postman
2. Create new request
3. Test endpoints
4. Add Authorization header untuk protected endpoints

### Using curl
```bash
# Get all projects
curl http://localhost:5000/api/projects

# Create project (with token)
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Project"}'
```

## 🐛 Troubleshooting

### Backend tidak berjalan?
```bash
# Check if port 5000 is available
# Change PORT in .env if needed
PORT=5001
npm run dev
```

### Database connection error?
- Verify DATABASE_URL di .env
- Check Supabase credentials
- Ensure IPv4 Pooler is selected
- Test connection: `curl http://localhost:5000/api/test-db`

### CORS error?
- Update FRONTEND_URL di .env
- Verify frontend domain
- Check browser console

### Authentication error?
- Check JWT_SECRET di .env
- Verify token format
- Check Authorization header

## 📋 Checklist

### Setup
- [ ] Database setup di Supabase
- [ ] .env configured
- [ ] npm install done
- [ ] npm run dev running
- [ ] Health endpoint working

### Testing
- [ ] Authentication working
- [ ] CRUD operations working
- [ ] Error handling working
- [ ] Frontend integrated

### Deployment
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Production URL working

## 📞 Need Help?

### Documentation
1. **Quick Start**: backend-api/README.md
2. **Common Tasks**: backend-api/QUICK_REFERENCE.md
3. **Database**: backend-api/DATABASE_SETUP.md
4. **Deployment**: backend-api/DEPLOYMENT.md
5. **Frontend**: backend-api/FRONTEND_INTEGRATION.md

### Troubleshooting
- Check backend-api/README.md troubleshooting section
- Check backend-api/DEPLOYMENT.md troubleshooting section
- Review error messages in terminal
- Check browser console for errors

## 🎯 Next Steps

### Today
1. ✅ Setup database
2. ✅ Configure environment
3. ✅ Run development server
4. ✅ Test endpoints

### Tomorrow
1. Update frontend API URL
2. Test frontend-backend integration
3. Fix any issues

### This Week
1. Deploy to Render
2. Test production
3. Monitor errors

## 💡 Tips

- Use Postman untuk test API
- Check logs di terminal
- Use `npm run dev` untuk auto-reload
- Test locally sebelum deploy
- Keep .env file secure
- Never commit .env file

## 🎉 You're Ready!

Backend INVERSA API siap digunakan. Mulai dengan:

1. Setup database
2. Configure environment
3. Run development server
4. Test endpoints
5. Integrate dengan frontend
6. Deploy ke Render

**Happy coding!** 🚀

---

**Questions?** Check the documentation files in backend-api/ folder.

**Ready to deploy?** Follow the deployment guide in backend-api/DEPLOYMENT.md.

**Need to integrate frontend?** Check backend-api/FRONTEND_INTEGRATION.md.
