# INVERSA Platform - Implementation Guide

## Overview
This guide provides step-by-step instructions for completing the backend-frontend-database alignment and preparing for deployment to Vercel (frontend), Render (backend), and Supabase (database).

---

## PHASE 1: Frontend Data Manager Updates ✅ COMPLETED

### What Was Done
1. **Created API Transformer Utility** (`src/utils/apiTransformer.js`)
   - `toCamelCase()` - Converts snake_case API responses to camelCase
   - `toSnakeCase()` - Converts camelCase frontend data to snake_case for API
   - Handles nested objects and arrays recursively

2. **Updated Section Manager** (`src/utils/dataManager/sectionManager.js`)
   - Fixed field name: `order` → `sectionNumber`
   - Added missing fields: `imageUrl`, `caption`, `type`
   - Integrated API calls with transformer
   - Fallback to localStorage when API unavailable

3. **Updated Brainstorm Manager** (`src/utils/dataManager/brainstormManager.js`)
   - Consolidated storage: Single `brainstormSessions` key
   - Added `title` field to ideas (was missing)
   - Added `discussions` array to sessions
   - Integrated API calls with transformer
   - Added discussion and note management functions

4. **Updated Project Manager** (`src/utils/dataManager/projectManager.js`)
   - Added API transformer for snake_case conversion
   - Updated `loadPublishedProjects()` to use API query parameter
   - Converts API responses to camelCase automatically

5. **Updated Chapter Manager** (`src/utils/dataManager/chapterManager.js`)
   - Added API transformer for snake_case conversion
   - Converts API responses to camelCase automatically
   - Maintains backward compatibility with localStorage

6. **Updated User Storage** (`src/utils/userManager/userStorage.js`)
   - Changed field: `avatar` → `profileImage`
   - Added `bio` field to dummy users
   - Maintains consistency with database schema

---

## PHASE 2: Backend Route Verification (NEXT)

### What Needs to Be Done

#### 2.1 Verify Projects Route (`backend/routes/projects.js`)
- ✅ Uses snake_case field names (already correct)
- ✅ Supports `published` query parameter
- ⚠️ **TODO**: Add missing endpoints:
  - `GET /projects/:id/chapters` - Get all chapters for a project
  - `GET /projects/:id/brainstorm` - Get brainstorm session
  - `PUT /projects/:id/publish` - Publish a project

#### 2.2 Verify Chapters Route (`backend/routes/chapters.js`)
- ✅ Uses snake_case field names (already correct)
- ✅ Supports `projectId` query parameter
- ⚠️ **TODO**: Add missing endpoints:
  - `GET /chapters/:id/sections` - Get all sections for a chapter
  - `PUT /chapters/:id/publish` - Publish a chapter
  - `PUT /chapters/:id/lock` - Lock chapter for editing
  - `PUT /chapters/:id/unlock` - Unlock chapter

#### 2.3 Verify Sections Route (`backend/routes/sections.js`)
- ✅ Uses `section_number` field (correct)
- ✅ Supports `chapterId` query parameter
- ⚠️ **TODO**: Add missing fields in response:
  - Ensure `image_url` and `caption` are returned
  - Add `type` field to response

#### 2.4 Verify Brainstorm Route (`backend/routes/brainstorm.js`)
- ⚠️ **TODO**: Verify all endpoints exist:
  - `GET /brainstorm?projectId=X` - Get brainstorm session
  - `POST /brainstorm/ideas` - Create idea with `title` field
  - `DELETE /brainstorm/ideas/:id` - Delete idea
  - `POST /brainstorm/tasks` - Create task
  - `PUT /brainstorm/tasks/:id` - Update task
  - `DELETE /brainstorm/tasks/:id` - Delete task
  - `POST /brainstorm/discussions` - Create discussion
  - `DELETE /brainstorm/discussions/:id` - Delete discussion
  - `POST /brainstorm/notes` - Create note
  - `DELETE /brainstorm/notes/:id` - Delete note

#### 2.5 Verify Teams Route (`backend/routes/teams.js`)
- ⚠️ **TODO**: Verify all endpoints use snake_case consistently

#### 2.6 Verify Users Route (`backend/routes/users.js`)
- ⚠️ **TODO**: Verify `profile_image` field is used (not `avatar`)

---

## PHASE 3: Database Schema Verification (NEXT)

### Current Status
- ✅ Database schema is mostly correct
- ✅ Uses snake_case field names
- ✅ Soft deletes implemented
- ⚠️ **TODO**: Verify the following:

#### 3.1 Sections Table
```sql
-- Current schema (CORRECT)
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  content TEXT,
  image_url TEXT,
  caption TEXT,
  section_order INTEGER NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Issue**: Field is named `section_order` but should be `section_number` for consistency with API.

**Fix**: Update database schema:
```sql
ALTER TABLE sections RENAME COLUMN section_order TO section_number;
```

#### 3.2 Ideas Table
```sql
-- Current schema (NEEDS UPDATE)
CREATE TABLE ideas (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER NOT NULL,
  chapter_id INTEGER,
  title VARCHAR(255) NOT NULL,  -- ✅ GOOD
  description TEXT,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Status**: ✅ Already has `title` field

#### 3.3 Users Table
```sql
-- Current schema (CORRECT)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  profile_image TEXT,  -- ✅ CORRECT (not avatar)
  bio TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
```

**Status**: ✅ Already correct

---

## PHASE 4: Integration Testing (NEXT)

### Test Scenarios

#### 4.1 Project Creation Flow
```javascript
// Frontend sends camelCase
const project = {
  title: "My Project",
  description: "...",
  categoryId: "novel",
  genreId: "romance",
  isTeamProject: false
};

// projectManager converts to snake_case
// API receives and stores in database
// API returns snake_case
// Frontend converts back to camelCase
```

#### 4.2 Chapter Creation Flow
```javascript
// Frontend sends camelCase
const chapter = {
  projectId: 1,
  title: "Chapter 1",
  chapterNumber: 1,
  status: "draft"
};

// chapterManager converts to snake_case
// API receives and stores in database
// API returns snake_case
// Frontend converts back to camelCase
```

#### 4.3 Section Creation Flow
```javascript
// Frontend sends camelCase
const section = {
  chapterId: 1,
  sectionNumber: 1,
  type: "text",
  content: "...",
  imageUrl: null,
  caption: null
};

// sectionManager converts to snake_case
// API receives and stores in database
// API returns snake_case
// Frontend converts back to camelCase
```

#### 4.4 Brainstorm Flow
```javascript
// Frontend sends camelCase
const idea = {
  title: "New Idea",
  description: "...",
  chapterReference: 1
};

// brainstormManager converts to snake_case
// API receives and stores in database
// API returns snake_case
// Frontend converts back to camelCase
```

---

## PHASE 5: Deployment Preparation (NEXT)

### 5.1 Environment Variables

#### Frontend (.env)
```
VITE_API_BASE_URL=https://inversa-backend.onrender.com/api
VITE_APP_NAME=INVERSA
```

#### Backend (.env)
```
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/inversa_db
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://inversa.vercel.app
```

#### Database (Supabase)
- Create PostgreSQL database
- Run `INVERSA_DATABASE_SETUP.sql`
- Create application user with appropriate permissions

### 5.2 Deployment Checklist

#### Frontend (Vercel)
- [ ] Update `VITE_API_BASE_URL` to production backend URL
- [ ] Build: `npm run build`
- [ ] Deploy to Vercel
- [ ] Test API connectivity

#### Backend (Render)
- [ ] Update environment variables
- [ ] Connect to Supabase PostgreSQL
- [ ] Deploy to Render
- [ ] Test database connectivity
- [ ] Verify all endpoints respond correctly

#### Database (Supabase)
- [ ] Create PostgreSQL instance
- [ ] Run database setup script
- [ ] Create application user
- [ ] Set up backups
- [ ] Enable SSL connections

---

## PHASE 6: Post-Deployment Verification (NEXT)

### 6.1 API Endpoint Testing

```bash
# Test project creation
curl -X POST https://inversa-backend.onrender.com/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Test Project",
    "description": "Test",
    "category_id": "novel",
    "genre_id": "romance"
  }'

# Test chapter creation
curl -X POST https://inversa-backend.onrender.com/api/chapters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "project_id": 1,
    "title": "Chapter 1",
    "description": "Test chapter"
  }'

# Test section creation
curl -X POST https://inversa-backend.onrender.com/api/sections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "chapter_id": 1,
    "type": "text",
    "content": "Section content"
  }'
```

### 6.2 Frontend Testing

- [ ] Create a new project
- [ ] Create chapters
- [ ] Create sections
- [ ] Test brainstorming features
- [ ] Test team collaboration
- [ ] Verify data persists in database
- [ ] Test offline mode (localStorage fallback)

---

## PHASE 7: Data Migration (OPTIONAL)

### 7.1 Migrate Existing localStorage Data to Database

```javascript
// Migration script
async function migrateLocalStorageToDatabase() {
  // 1. Get all localStorage data
  const projects = JSON.parse(localStorage.getItem('inversa_projects'));
  const chapters = JSON.parse(localStorage.getItem('inversa_chapters'));
  const sections = JSON.parse(localStorage.getItem('inversa_sections'));
  
  // 2. Convert camelCase to snake_case
  const projectsSnakeCase = projects.map(p => toSnakeCase(p));
  const chaptersSnakeCase = chapters.map(c => toSnakeCase(c));
  const sectionsSnakeCase = sections.map(s => toSnakeCase(s));
  
  // 3. Send to API for database storage
  await fetch('/api/migrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projects: projectsSnakeCase,
      chapters: chaptersSnakeCase,
      sections: sectionsSnakeCase
    })
  });
  
  // 4. Clear localStorage after successful migration
  localStorage.removeItem('inversa_projects');
  localStorage.removeItem('inversa_chapters');
  localStorage.removeItem('inversa_sections');
}
```

---

## QUICK REFERENCE: Field Name Mappings

### Projects
| Frontend (camelCase) | Database (snake_case) |
|---|---|
| projectId | project_id |
| initiatorId | initiator_id |
| categoryId | category_id |
| genreId | genre_id |
| isTeamProject | is_team_project |
| teamId | team_id |
| hasPublishedChapters | has_published_chapters |
| backgroundImage | background_image |
| createdAt | created_at |
| updatedAt | updated_at |
| deletedAt | deleted_at |

### Chapters
| Frontend (camelCase) | Database (snake_case) |
|---|---|
| projectId | project_id |
| chapterNumber | chapter_number |
| createdBy | created_by |
| lockedBy | locked_by |
| lockedAt | locked_at |
| createdAt | created_at |
| updatedAt | updated_at |
| deletedAt | deleted_at |

### Sections
| Frontend (camelCase) | Database (snake_case) |
|---|---|
| chapterId | chapter_id |
| sectionNumber | section_number |
| imageUrl | image_url |
| createdAt | created_at |
| updatedAt | updated_at |

### Users
| Frontend (camelCase) | Database (snake_case) |
|---|---|
| profileImage | profile_image |
| passwordHash | password_hash |
| createdAt | created_at |
| updatedAt | updated_at |
| deletedAt | deleted_at |

---

## TROUBLESHOOTING

### Issue: API returns snake_case but frontend expects camelCase
**Solution**: Ensure `toCamelCase()` is called on all API responses in data managers

### Issue: Frontend sends camelCase but API expects snake_case
**Solution**: Ensure `toSnakeCase()` is called before sending data to API

### Issue: localStorage data doesn't sync with database
**Solution**: Check that API is available and responding correctly; verify network requests in browser DevTools

### Issue: Section ordering is incorrect
**Solution**: Verify `sectionNumber` field is being used consistently (not `order` or `section_order`)

### Issue: User profile images not loading
**Solution**: Verify `profile_image` field is being used (not `avatar`)

---

## NEXT STEPS

1. **Verify Backend Routes** - Check all endpoints use snake_case consistently
2. **Update Database Schema** - Rename `section_order` to `section_number`
3. **Run Integration Tests** - Test full flow from frontend to database
4. **Deploy to Staging** - Test on staging environment before production
5. **Deploy to Production** - Deploy to Vercel, Render, and Supabase
6. **Monitor and Debug** - Watch for errors and fix issues as they arise

---

**Last Updated**: May 14, 2026
**Status**: Phase 1 Complete, Phase 2-7 Ready for Implementation
