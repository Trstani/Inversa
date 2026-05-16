# INVERSA Backend Structure

## Overview

The INVERSA backend is a Node.js/Express application that serves as the central data layer for the frontend, communicating with Supabase PostgreSQL database.

**Architecture**: Express.js → PostgreSQL (Supabase)
**Port**: 5000
**Database**: Supabase PostgreSQL

---

## Directory Structure

```
backend/
├── config/
│   └── database.js              # Database connection configuration
├── middleware/
│   └── auth.js                  # JWT authentication middleware
├── routes/
│   ├── auth.js                  # Authentication endpoints
│   ├── users.js                 # User management endpoints
│   ├── projects.js              # Project endpoints
│   ├── chapters.js              # Chapter endpoints
│   ├── sections.js              # Section endpoints
│   ├── teams.js                 # Team endpoints
│   ├── brainstorm.js            # Brainstorm endpoints
│   └── collaboration.js         # Collaboration endpoints
├── services/                    # NEW: Business logic layer
│   ├── userService.js           # User operations
│   ├── projectService.js        # Project operations
│   ├── chapterService.js        # Chapter operations
│   ├── teamService.js           # Team operations
│   ├── brainstormService.js     # Brainstorm operations
│   ├── sectionService.js        # Section operations
│   ├── collaborationService.js  # Collaboration operations
│   ├── readingHistoryService.js # Reading history operations
│   ├── reportService.js         # Report operations
│   └── index.js                 # Services export
├── scripts/
│   └── setup-database.js        # Database initialization script
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── server.js                    # Main application file
└── README.md                    # Backend documentation
```

---

## Key Components

### 1. Database Configuration (`backend/config/database.js`)

Handles PostgreSQL connection to Supabase with SSL support.

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});
```

**Environment Variables**:
- `DB_HOST` - Supabase host (IPv4 pooler)
- `DB_PORT` - Database port (6543 for pooler)
- `DB_NAME` - Database name (postgres)
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password

---

### 2. Authentication Middleware (`backend/middleware/auth.js`)

Verifies JWT tokens and attaches user info to request.

```javascript
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

**Usage**: Add to protected routes
```javascript
router.post('/protected', verifyToken, (req, res) => {
  // req.user contains decoded token
});
```

---

### 3. Services Layer (`backend/services/`)

**NEW**: Business logic layer that replaces localStorage utilities.

Each service file contains functions for specific domain:

```javascript
// Example: userService.js
export const registerUser = async (name, email, password) => {
  // Validation
  // Hash password
  // Insert into database
  // Return response
};

export const loginUser = async (email, password) => {
  // Find user
  // Verify password
  // Generate JWT token
  // Return response
};
```

**Benefits**:
- Centralized business logic
- Reusable across routes
- Easy to test
- Consistent error handling
- Database abstraction

---

### 4. Route Handlers (`backend/routes/`)

Express route handlers that use services.

```javascript
// Example: projects.js
router.get('/', async (req, res) => {
  try {
    const result = await projectService.getAllProjects(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const result = await projectService.createProject(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

### 5. Main Application (`backend/server.js`)

Express app setup with middleware and routes.

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
// ... more routes

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});
```

---

## API Response Format

All endpoints return consistent JSON response:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error message"
}
```

---

## Authentication Flow

### 1. User Registration
```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response:
{
  "success": true,
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
  "message": "User registered successfully"
}
```

### 2. User Login
```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```

### 3. Protected Request
```
GET /api/projects
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
{
  "success": true,
  "projects": [...]
}
```

---

## Database Tables

### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  avatar VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

### Projects
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id VARCHAR(50),
  genre_id VARCHAR(50),
  background_image VARCHAR(255),
  initiator_id INTEGER REFERENCES users(id),
  is_team_project BOOLEAN DEFAULT false,
  team_id INTEGER REFERENCES teams(id),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  has_published_chapters BOOLEAN DEFAULT false,
  hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

### Chapters
```sql
CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  chapter_number INTEGER,
  title VARCHAR(255),
  description TEXT,
  content TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  locked_by INTEGER REFERENCES users(id),
  locked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

### Teams
```sql
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  background_image VARCHAR(255),
  initiator_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

### Team Collaborators
```sql
CREATE TABLE team_collaborators (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id),
  user_id INTEGER REFERENCES users(id),
  role VARCHAR(50) DEFAULT 'member',
  status VARCHAR(50) DEFAULT 'pending',
  joined_at TIMESTAMP DEFAULT NOW()
);
```

### Brainstorms
```sql
CREATE TABLE brainstorms (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Ideas
```sql
CREATE TABLE ideas (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER REFERENCES brainstorms(id),
  chapter_id INTEGER REFERENCES chapters(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  votes INTEGER DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

### Sections
```sql
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER REFERENCES chapters(id),
  type VARCHAR(50),
  section_number INTEGER,
  content TEXT,
  image_url VARCHAR(255),
  caption TEXT,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

---

## Environment Variables

Create `.env` file in `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (Supabase)
DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.pcmxbqeaocatcfyrlczt
DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## Running the Backend

### Development
```bash
cd backend
npm install
npm start
```

Backend will run on `http://localhost:5000`

### Production
```bash
npm run build
npm run start:prod
```

---

## Testing

### Test Database Connection
```bash
curl http://localhost:5000/api/test-db
```

Response:
```json
{
  "success": true,
  "data": {
    "now": "2026-05-14T08:48:29.152Z"
  }
}
```

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

---

## Error Handling

All services use try-catch and return consistent error format:

```javascript
try {
  // Operation
  return { success: true, data: result };
} catch (error) {
  console.error('Error:', error);
  return { success: false, error: error.message };
}
```

---

## Security Features

1. **Password Hashing**: bcryptjs for secure password storage
2. **JWT Authentication**: Token-based authentication
3. **CORS**: Configured for frontend domain
4. **Helmet**: Security headers
5. **SQL Injection Prevention**: Parameterized queries
6. **Soft Deletes**: Data preservation with deleted_at flag

---

## Performance Considerations

1. **Connection Pooling**: PostgreSQL connection pool
2. **Indexes**: Database indexes on frequently queried columns
3. **Pagination**: Implement for large datasets
4. **Caching**: Consider Redis for frequently accessed data
5. **Query Optimization**: Use efficient SQL queries

---

## Deployment

### Render.com (Recommended)
1. Push code to GitHub
2. Connect Render to GitHub repository
3. Set environment variables
4. Deploy

### Heroku
1. Create Heroku app
2. Set environment variables
3. Deploy using Git

### AWS/DigitalOcean
1. Set up server
2. Install Node.js
3. Clone repository
4. Set environment variables
5. Run with PM2 or similar

---

## Monitoring

### Logs
```bash
# View logs
npm run logs

# Real-time logs
npm run logs:watch
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

---

## Troubleshooting

### Database Connection Error
- Check `.env` file has correct credentials
- Verify Supabase is running
- Check network connectivity

### Authentication Error
- Verify JWT_SECRET is set
- Check token format in Authorization header
- Verify token hasn't expired

### CORS Error
- Check FRONTEND_URL in `.env`
- Verify CORS middleware is configured
- Check browser console for specific error

---

## References

- Express.js: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/
- Supabase: https://supabase.com/
- JWT: https://jwt.io/
- bcryptjs: https://github.com/dcodeIO/bcrypt.js

---

**Last Updated**: May 15, 2026
**Status**: Production Ready
