# INVERSA Platform - Complete Deployment Guide

Panduan lengkap untuk deploy INVERSA Platform ke production dengan:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase (PostgreSQL)

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- Supabase account (free)
- Git installed locally

---

## 🗄️ Step 1: Setup Database di Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Project name: `inversa`
   - Database password: (save this!)
   - Region: Choose closest to you
4. Click "Create new project"

### 1.2 Get Connection String

1. Go to Project Settings → Database
2. Copy "Connection string" (PostgreSQL)
3. Format: `postgresql://postgres:PASSWORD@HOST:5432/postgres`

### 1.3 Create Tables

1. Go to SQL Editor
2. Create new query
3. Copy content dari `INVERSA_DATABASE_SETUP.sql`
4. Paste dan run

Atau gunakan psql:
```bash
psql "postgresql://postgres:PASSWORD@HOST:5432/postgres" -f INVERSA_DATABASE_SETUP.sql
```

---

## 🚀 Step 2: Deploy Backend ke Render

### 2.1 Prepare Backend

1. Create GitHub repository untuk backend:
```bash
cd backend
git init
git add .
git commit -m "Initial backend setup"
git remote add origin https://github.com/YOUR_USERNAME/inversa-backend.git
git push -u origin main
```

2. Update `.env` (jangan push ke GitHub):
```env
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres
PORT=5000
NODE_ENV=production
JWT_SECRET=generate_random_secret_here
FRONTEND_URL=https://your-frontend.vercel.app
```

### 2.2 Deploy ke Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Fill in details:
   - **Name**: `inversa-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `DATABASE_URL`: (dari Supabase)
   - `JWT_SECRET`: (generate random string)
   - `FRONTEND_URL`: (akan update nanti)
   - `NODE_ENV`: `production`

6. Click "Create Web Service"

7. Wait untuk deployment selesai
8. Copy URL backend (e.g., `https://inversa-backend.onrender.com`)

### 2.3 Update Environment Variables

1. Go ke Render dashboard
2. Select project → Environment
3. Update `FRONTEND_URL` dengan URL frontend Vercel (akan di-update setelah deploy frontend)

---

## 🎨 Step 3: Deploy Frontend ke Vercel

### 3.1 Prepare Frontend

1. Update `.env.production`:
```env
VITE_API_URL=https://inversa-backend.onrender.com/api
```

2. Update `src/utils/dataManager/storageUtils.js`:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

3. Push ke GitHub:
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

### 3.2 Deploy ke Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import GitHub repository (frontend)
4. Fill in details:
   - **Project Name**: `inversa`
   - **Framework**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   - `VITE_API_URL`: `https://inversa-backend.onrender.com/api`

6. Click "Deploy"

7. Wait untuk deployment selesai
8. Copy URL frontend (e.g., `https://inversa.vercel.app`)

### 3.3 Update Backend FRONTEND_URL

1. Go ke Render dashboard
2. Select `inversa-backend` project
3. Go to Environment
4. Update `FRONTEND_URL` dengan URL frontend Vercel
5. Redeploy backend

---

## ✅ Step 4: Verification

### 4.1 Test Backend Health

```bash
curl https://inversa-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "INVERSA Backend is running"
}
```

### 4.2 Test Database Connection

```bash
curl https://inversa-backend.onrender.com/api/users
```

Should return users list (empty if new database)

### 4.3 Test Frontend

1. Open `https://inversa.vercel.app`
2. Try to register new account
3. Check if data saved to database

### 4.4 Test API Integration

1. Register account via frontend
2. Check Supabase → users table
3. Verify user data saved correctly

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong and random
- [ ] DATABASE_URL tidak di-commit ke GitHub
- [ ] CORS FRONTEND_URL di-set dengan benar
- [ ] Environment variables di-set di Render
- [ ] Database backups enabled di Supabase
- [ ] SSL/HTTPS enabled (automatic di Vercel & Render)

---

## 📊 Monitoring & Logs

### Backend Logs (Render)

1. Go to Render dashboard
2. Select project
3. Click "Logs" tab
4. View real-time logs

### Database Logs (Supabase)

1. Go to Supabase dashboard
2. Click "Logs" → "Database"
3. View query logs

### Frontend Logs (Vercel)

1. Go to Vercel dashboard
2. Select project
3. Click "Deployments"
4. View build logs

---

## 🔄 Continuous Deployment

### Auto-Deploy on Push

**Render**: Automatically deploys when you push to main branch

**Vercel**: Automatically deploys when you push to main branch

### Manual Redeploy

**Render**:
1. Go to project
2. Click "Manual Deploy" → "Deploy latest commit"

**Vercel**:
1. Go to project
2. Click "Deployments"
3. Click "Redeploy" on latest deployment

---

## 🐛 Troubleshooting

### Backend Not Connecting to Database

1. Check DATABASE_URL di Render environment
2. Verify Supabase connection string
3. Check Supabase firewall settings
4. View Render logs untuk error details

### Frontend Can't Connect to Backend

1. Check VITE_API_URL di Vercel environment
2. Verify backend URL is correct
3. Check CORS settings di backend
4. View browser console untuk error details

### Database Queries Failing

1. Check SQL syntax di INVERSA_DATABASE_SETUP.sql
2. Verify tables created di Supabase
3. Check user permissions
4. View Supabase logs

### Deployment Stuck

1. Check build logs
2. Verify environment variables
3. Try manual redeploy
4. Contact support jika masih error

---

## 📈 Performance Optimization

### Frontend (Vercel)

- [ ] Enable image optimization
- [ ] Enable edge caching
- [ ] Setup analytics
- [ ] Monitor Core Web Vitals

### Backend (Render)

- [ ] Setup auto-scaling (paid plan)
- [ ] Enable caching headers
- [ ] Monitor response times
- [ ] Setup error tracking

### Database (Supabase)

- [ ] Enable connection pooling
- [ ] Setup backups
- [ ] Monitor query performance
- [ ] Optimize indexes

---

## 💰 Cost Estimation

### Free Tier (Recommended for Development)

- **Vercel**: Free (up to 100GB bandwidth/month)
- **Render**: Free (auto-sleeps after 15 min inactivity)
- **Supabase**: Free (500MB storage, 2GB bandwidth/month)

### Paid Tier (for Production)

- **Vercel**: $20/month (Pro plan)
- **Render**: $7/month (Starter plan)
- **Supabase**: $25/month (Pro plan)

---

## 🔄 Update & Maintenance

### Update Backend

1. Make changes locally
2. Test locally
3. Push to GitHub
4. Render auto-deploys
5. Verify deployment

### Update Frontend

1. Make changes locally
2. Test locally
3. Push to GitHub
4. Vercel auto-deploys
5. Verify deployment

### Database Migrations

1. Create migration script
2. Test locally
3. Run on Supabase
4. Verify data integrity

---

## 📚 Useful Links

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 🆘 Support

### Get Help

1. Check logs di respective platforms
2. Read documentation
3. Search GitHub issues
4. Contact platform support

### Report Issues

1. Create GitHub issue dengan details
2. Include error logs
3. Include steps to reproduce
4. Include environment info

---

## ✨ Next Steps

1. ✅ Setup database di Supabase
2. ✅ Deploy backend ke Render
3. ✅ Deploy frontend ke Vercel
4. ✅ Test integration
5. ✅ Monitor performance
6. ✅ Setup backups
7. ✅ Configure monitoring
8. ✅ Plan scaling strategy

---

**Congratulations! 🎉 INVERSA Platform is now live!**

Frontend: https://inversa.vercel.app
Backend: https://inversa-backend.onrender.com
Database: Supabase PostgreSQL

---

Last Updated: May 14, 2026
