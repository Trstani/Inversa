# Backend Setup Checklist

Checklist lengkap untuk setup dan deploy INVERSA Backend.

---

## 📋 Pre-Deployment Checklist

### Local Setup
- [ ] Node.js 16+ installed
- [ ] PostgreSQL installed locally (untuk testing)
- [ ] Git installed
- [ ] GitHub account created
- [ ] Vercel account created
- [ ] Render account created
- [ ] Supabase account created

### Backend Files
- [ ] `backend/server.js` created
- [ ] `backend/package.json` created
- [ ] `backend/.env.example` created
- [ ] `backend/config/database.js` created
- [ ] `backend/middleware/auth.js` created
- [ ] `backend/routes/auth.js` created
- [ ] `backend/routes/users.js` created
- [ ] `backend/routes/projects.js` created
- [ ] `backend/routes/chapters.js` created
- [ ] `backend/routes/teams.js` created
- [ ] `backend/routes/brainstorm.js` created
- [ ] `backend/routes/collaboration.js` created
- [ ] `backend/README.md` created
- [ ] `backend/FRONTEND_INTEGRATION.md` created
- [ ] `backend/BACKEND_SUMMARY.md` created

### Documentation
- [ ] `DEPLOYMENT_GUIDE.md` created
- [ ] `BACKEND_SETUP_CHECKLIST.md` created (this file)

---

## 🔧 Local Development Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```
- [ ] Dependencies installed successfully
- [ ] No errors during installation

### Step 2: Setup Environment
```bash
cp .env.example .env
```
- [ ] `.env` file created
- [ ] Edit `.env` dengan local database credentials

### Step 3: Test Local Database
```bash
# Create local database
createdb inversa

# Run SQL script
psql -U postgres -d inversa -f ../INVERSA_DATABASE_SETUP.sql
```
- [ ] Database created
- [ ] Tables created successfully
- [ ] No SQL errors

### Step 4: Start Local Server
```bash
npm run dev
```
- [ ] Server running on port 5000
- [ ] No errors in console
- [ ] Can access http://localhost:5000/api/health

### Step 5: Test API Endpoints
```bash
# Test health
curl http://localhost:5000/api/health

# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```
- [ ] Health endpoint returns OK
- [ ] Register endpoint works
- [ ] User created in database

---

## 🌐 Supabase Setup

### Step 1: Create Project
- [ ] Go to supabase.com
- [ ] Create new project
- [ ] Save database password
- [ ] Wait for project creation

### Step 2: Get Connection String
- [ ] Go to Project Settings → Database
- [ ] Copy PostgreSQL connection string
- [ ] Format: `postgresql://postgres:PASSWORD@HOST:5432/postgres`

### Step 3: Create Tables
- [ ] Go to SQL Editor
- [ ] Create new query
- [ ] Copy content dari `INVERSA_DATABASE_SETUP.sql`
- [ ] Run query
- [ ] Verify all tables created

### Step 4: Verify Database
- [ ] Go to Table Editor
- [ ] See all 20 tables listed
- [ ] Check table structures
- [ ] Verify relationships

---

## 🚀 Render Deployment

### Step 1: Prepare GitHub Repository
```bash
cd backend
git init
git add .
git commit -m "Initial backend setup"
git remote add origin https://github.com/YOUR_USERNAME/inversa-backend.git
git push -u origin main
```
- [ ] Repository created on GitHub
- [ ] Code pushed successfully
- [ ] Main branch has all files

### Step 2: Create Render Service
- [ ] Go to render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select `inversa-backend` repository

### Step 3: Configure Service
- [ ] Name: `inversa-backend`
- [ ] Environment: `Node`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Plan: Free

### Step 4: Add Environment Variables
- [ ] `DATABASE_URL`: (dari Supabase)
- [ ] `JWT_SECRET`: (generate random)
- [ ] `FRONTEND_URL`: (temporary, update later)
- [ ] `NODE_ENV`: `production`

### Step 5: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Check deployment logs
- [ ] Verify no errors

### Step 6: Test Deployment
- [ ] Get backend URL (e.g., https://inversa-backend.onrender.com)
- [ ] Test health endpoint:
  ```bash
  curl https://inversa-backend.onrender.com/api/health
  ```
- [ ] Should return OK status

---

## 🎨 Vercel Frontend Deployment

### Step 1: Update Frontend Code
- [ ] Update `.env.production`:
  ```env
  VITE_API_URL=https://inversa-backend.onrender.com/api
  ```
- [ ] Update `src/utils/dataManager/storageUtils.js`
- [ ] Verify all API calls use correct URL

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```
- [ ] Changes pushed to GitHub
- [ ] Main branch updated

### Step 3: Deploy to Vercel
- [ ] Go to vercel.com
- [ ] Click "Add New..." → "Project"
- [ ] Import GitHub repository (frontend)
- [ ] Project Name: `inversa`
- [ ] Framework: `Vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Step 4: Add Environment Variables
- [ ] `VITE_API_URL`: `https://inversa-backend.onrender.com/api`

### Step 5: Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Check build logs
- [ ] Verify no errors

### Step 6: Get Frontend URL
- [ ] Copy frontend URL (e.g., https://inversa.vercel.app)
- [ ] Save for next step

---

## 🔄 Update Backend CORS

### Step 1: Update Render Environment
- [ ] Go to Render dashboard
- [ ] Select `inversa-backend` project
- [ ] Go to Environment
- [ ] Update `FRONTEND_URL`: (paste Vercel URL)
- [ ] Save changes

### Step 2: Redeploy Backend
- [ ] Click "Manual Deploy" → "Deploy latest commit"
- [ ] Wait for redeployment
- [ ] Verify deployment successful

---

## ✅ Integration Testing

### Test 1: Register User
- [ ] Go to frontend URL
- [ ] Click Register
- [ ] Fill form dengan test data
- [ ] Submit
- [ ] Check if user created in Supabase

### Test 2: Login User
- [ ] Go to frontend URL
- [ ] Click Login
- [ ] Enter credentials
- [ ] Submit
- [ ] Check if login successful

### Test 3: Create Project
- [ ] Login to frontend
- [ ] Create new project
- [ ] Fill project details
- [ ] Submit
- [ ] Check if project created in Supabase

### Test 4: Create Chapter
- [ ] Go to project
- [ ] Create new chapter
- [ ] Fill chapter details
- [ ] Submit
- [ ] Check if chapter created in Supabase

### Test 5: Team Collaboration
- [ ] Create team
- [ ] Add team member
- [ ] Create team project
- [ ] Verify team member can edit

### Test 6: Brainstorming
- [ ] Go to project brainstorm
- [ ] Create idea
- [ ] Add comment
- [ ] Create task
- [ ] Verify all saved in database

---

## 🔐 Security Verification

- [ ] JWT_SECRET is strong (min 32 characters)
- [ ] DATABASE_URL tidak di-commit ke GitHub
- [ ] FRONTEND_URL di-set dengan benar
- [ ] Environment variables di-set di Render
- [ ] No sensitive data di-hardcode
- [ ] CORS properly configured
- [ ] Password hashing enabled
- [ ] Input validation enabled

---

## 📊 Performance Verification

- [ ] Backend responds in < 500ms
- [ ] Database queries optimized
- [ ] No N+1 queries
- [ ] Connection pooling working
- [ ] Error handling comprehensive
- [ ] Logging enabled
- [ ] No memory leaks

---

## 📝 Documentation Verification

- [ ] README.md complete
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment steps documented
- [ ] Troubleshooting guide included
- [ ] Integration guide complete

---

## 🚨 Troubleshooting

### If Backend Deployment Fails
- [ ] Check build logs di Render
- [ ] Verify package.json syntax
- [ ] Check for missing dependencies
- [ ] Verify Node version compatible
- [ ] Check environment variables set

### If Database Connection Fails
- [ ] Verify DATABASE_URL correct
- [ ] Check Supabase connection string
- [ ] Verify database exists
- [ ] Check firewall settings
- [ ] Test connection locally first

### If Frontend Can't Connect to Backend
- [ ] Check VITE_API_URL correct
- [ ] Verify backend URL accessible
- [ ] Check CORS settings
- [ ] Check browser console for errors
- [ ] Test API endpoint directly

### If Tests Fail
- [ ] Check test data format
- [ ] Verify database has data
- [ ] Check API response format
- [ ] Verify authentication working
- [ ] Check error messages

---

## 📈 Post-Deployment

### Monitoring
- [ ] Setup error tracking
- [ ] Monitor response times
- [ ] Check database performance
- [ ] Monitor error rates
- [ ] Setup alerts

### Backups
- [ ] Enable Supabase backups
- [ ] Test backup restoration
- [ ] Document backup procedure
- [ ] Schedule regular backups

### Scaling
- [ ] Monitor resource usage
- [ ] Plan for scaling
- [ ] Setup auto-scaling (if needed)
- [ ] Optimize queries
- [ ] Add caching

### Updates
- [ ] Plan update schedule
- [ ] Test updates locally
- [ ] Deploy to staging first
- [ ] Monitor after deployment
- [ ] Have rollback plan

---

## 🎉 Final Checklist

- [ ] Backend deployed to Render
- [ ] Database setup in Supabase
- [ ] Frontend deployed to Vercel
- [ ] Integration tested
- [ ] Security verified
- [ ] Performance verified
- [ ] Documentation complete
- [ ] Monitoring setup
- [ ] Backups enabled
- [ ] Team notified

---

## 📞 Support Resources

- Backend README: `backend/README.md`
- Integration Guide: `backend/FRONTEND_INTEGRATION.md`
- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs

---

## ✨ Success Criteria

✅ **Backend is live** at https://inversa-backend.onrender.com
✅ **Frontend is live** at https://inversa.vercel.app
✅ **Database is live** at Supabase PostgreSQL
✅ **Integration working** - Frontend can communicate with Backend
✅ **Data persisting** - Data saved to database
✅ **Users can register** and login
✅ **Users can create** projects and chapters
✅ **Teams working** - Users can create and join teams
✅ **Brainstorming working** - Ideas, comments, tasks functional
✅ **All features working** - No errors in production

---

**Status**: Ready to Deploy! 🚀

Last Updated: May 14, 2026
