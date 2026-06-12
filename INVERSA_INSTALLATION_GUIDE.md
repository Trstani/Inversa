# Prosedur Instalasi INVERSA

INVERSA adalah platform kolaboratif yang terdiri dari dua bagian utama:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL + Supabase

## 1. Prasyarat (Prerequisites)

Sebelum memulai instalasi, pastikan sudah terpasang:
- **Node.js** v18 atau lebih tinggi
- **npm** atau **yarn** (npm biasanya sudah bundel dengan Node.js)
- **Git** untuk version control
- **PostgreSQL** (jika menjalankan backend secara lokal, atau gunakan Supabase cloud)
- **Text Editor/IDE** seperti VS Code

Untuk mengecek versi yang terpasang:
```bash
node --version
npm --version
git --version
```

## 2. Clone Repository

Mulai dengan clone repository INVERSA dari GitHub:

```bash
git clone https://github.com/username/INVERSA.st.git
cd INVERSA.st
```

Struktur folder akan terlihat seperti:
```
INVERSA.st/
├── INVERSA/                 # Frontend (React + Vite)
├── inversa-backend-api/     # Backend (Node.js + Express)
└── .git/
```

## 3. Setup Backend

### 3.1 Masuk ke folder backend
```bash
cd inversa-backend-api
```

### 3.2 Install dependencies backend
```bash
npm install
```

Ini akan menginstall semua package yang diperlukan:
- `express` - Web framework
- `pg` - PostgreSQL client
- `socket.io` - Real-time communication
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `multer` - File upload handling
- `nodemailer` - Email service
- `dotenv` - Environment variables

### 3.3 Setup environment variables

Buat atau edit file `.env` dengan konfigurasi berikut:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inversa_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your_secret_key_here_make_it_strong

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3.4 Setup Database

**Opsi 1: Menggunakan PostgreSQL lokal**
```bash
# Create database
createdb inversa_db

# Run migrations (jika ada file migrations)
npm run migrate
```

**Opsi 2: Menggunakan Supabase cloud (lebih mudah)**
- Buat akun di https://supabase.com
- Buat project baru
- Copy URL dan API key ke `.env`
- Supabase akan mengelola database PostgreSQL untuk Anda

### 3.5 Jalankan backend
```bash
npm run dev
```

Output yang diharapkan:
```
Server running on http://localhost:5000
Connected to database
```

Backend akan berjalan di `http://localhost:5000`

## 4. Setup Frontend

### 4.1 Keluar dari backend folder (buka terminal baru atau cd ke root)
```bash
cd ..
cd INVERSA
```

### 4.2 Install dependencies frontend
```bash
npm install
```

Ini akan menginstall:
- `react` & `react-dom` - UI framework
- `react-router-dom` - Routing
- `axios` - HTTP client
- `@supabase/supabase-js` - Supabase client
- `tailwindcss` - CSS framework
- `@tiptap/react` - Rich text editor
- `socket.io-client` - Real-time client
- Dan package lainnya

### 4.3 Setup environment variables

Buat atau edit file `.env` dengan konfigurasi berikut:

```
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Information
VITE_APP_NAME=INVERSA
VITE_APP_VERSION=2.0.0

# Feature Flags
VITE_ENABLE_DEBUG=true

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4.4 Jalankan frontend
```bash
npm run dev
```

Output yang diharapkan:
```
VITE v7.3.1  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

Frontend akan berjalan di `http://localhost:5173`

## 5. Akses Aplikasi

Setelah kedua bagian berjalan:

1. Buka browser dan akses: **http://localhost:5173**
2. Aplikasi INVERSA siap digunakan
3. Frontend akan berkomunikasi dengan backend melalui API di `http://localhost:5000/api`
4. Real-time features (socket.io) akan terkoneksi otomatis

## 6. Struktur Folder yang Penting

### Frontend (INVERSA/):
```
INVERSA/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Editor/          # Editor components
│   │   ├── Brainstorm/      # Brainstorm feature
│   │   └── tutorial/        # Tutorial components
│   ├── pages/ atau MainPage/ # Page components
│   ├── context/             # React context (auth, etc)
│   ├── api/                 # API client & calls
│   ├── utils/               # Utility functions
│   ├── assets/              # Images, icons
│   ├── AdminFolder/         # Admin dashboard
│   ├── InitiatorFolder/     # Initiator pages
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/                  # Static assets
├── .env                     # Environment variables
├── package.json             # Dependencies
└── vite.config.js           # Vite configuration
```

### Backend (inversa-backend-api/):
```
inversa-backend-api/
├── src/
│   ├── routes/              # API endpoints
│   ├── controllers/         # Business logic
│   ├── models/              # Database models
│   ├── middleware/          # Auth, validation, etc
│   ├── utils/               # Helper functions
│   ├── socket/              # Socket.io events
│   └── server.js            # Entry point
├── .env                     # Environment variables
├── package.json             # Dependencies
└── .gitignore               # Git ignore rules
```

## 7. Scripts yang Berguna

### Frontend
```bash
npm run dev      # Jalankan development server (hot reload)
npm run build    # Build untuk production
npm run preview  # Preview production build
npm run lint     # Jalankan ESLint untuk cek kode
```

### Backend
```bash
npm run dev      # Jalankan dengan nodemon (auto-reload saat ada perubahan)
npm start        # Jalankan production server
```

## 8. Troubleshooting Instalasi

### npm install error
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Port sudah terpakai
```bash
# Ubah PORT di .env atau tutup aplikasi yang menggunakan port
# Untuk mengecek port yang terpakai (di Windows):
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

### Database connection error
- Pastikan PostgreSQL running (jika menggunakan lokal)
- Atau gunakan Supabase cloud (lebih mudah)
- Cek konfigurasi DB di `.env`

### CORS error
- Pastikan `FRONTEND_URL` di backend `.env` benar
- Pastikan `VITE_API_URL` di frontend `.env` benar
- Restart kedua server

### Module not found error
```bash
# Jalankan npm install lagi di folder yang bersangkutan
npm install
```

### Hot reload tidak bekerja
- Restart dev server: Ctrl+C lalu jalankan `npm run dev` lagi
- Cek apakah file `.env` sudah ada
- Bersihkan cache browser (Ctrl+Shift+Delete)

## 9. Lingkungan Development vs Production

### Development (lokal)
```bash
# Frontend
VITE_API_URL=http://localhost:5000/api
NODE_ENV=development

# Backend
NODE_ENV=development
DB_HOST=localhost (atau Supabase URL)
```

### Production (deployment)
```bash
# Frontend
VITE_API_URL=https://api.inversa.com/api
NODE_ENV=production

# Backend
NODE_ENV=production
DB_HOST=production-database-url
JWT_SECRET=strong-secret-key
```

## 10. Fitur Utama INVERSA

Setelah instalasi berhasil, Anda dapat mengakses:

1. **Authentication**
   - Register/Login
   - Email verification
   - Password reset

2. **Solo Writing**
   - Buat project solo
   - Editor dengan rich text
   - Publish/draft chapters
   - Tambah images

3. **Collaboration**
   - Buat team projects
   - Invite collaborators
   - Real-time editing
   - Lock mechanism untuk prevent conflicts

4. **Reading**
   - Baca chapter
   - Comments & discussions
   - Reading history
   - Like & follow projects

5. **Dashboard**
   - Project management
   - Team management
   - Statistics & analytics
   - Notifications

6. **Admin Panel**
   - Manage users
   - Manage projects
   - View reports
   - System statistics

## 11. Kontribusi dan Development

Untuk development lebih lanjut:

```bash
# Update code dari repository
git pull origin main

# Membuat branch baru untuk feature
git checkout -b feature/nama-fitur

# Setelah selesai, push dan buat pull request
git push origin feature/nama-fitur
```

## 12. Dukungan

Jika mengalami masalah:
1. Cek dokumentasi di README.md
2. Lihat issue yang sudah ada di GitHub
3. Buat issue baru dengan detail lengkap
4. Hubungi tim development

---

**Selamat! INVERSA sudah siap digunakan.** 🚀

Untuk informasi lebih lanjut, lihat dokumentasi API di `/docs/api.md` dan architecture di `/docs/architecture.md`
