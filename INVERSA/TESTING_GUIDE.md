# Testing Guide - INVERSA Application

**Status**: Ready for Phase 5 Testing

---

## Quick Start

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### 2. Start Frontend Dev Server
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

### 3. Access Application
Open browser and go to `http://localhost:5173`

---

## Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] JWT token stored in localStorage
- [ ] Logout clears token
- [ ] Protected routes redirect to login

### Projects
- [ ] Create new project
- [ ] View project list
- [ ] Edit project details
- [ ] Delete project
- [ ] Like/unlike project
- [ ] View project views counter

### Chapters
- [ ] Create chapter in project
- [ ] Edit chapter content
- [ ] Delete chapter
- [ ] Publish/unpublish chapter
- [ ] Lock/unlock chapter
- [ ] Navigate between chapters

### Reading
- [ ] Read chapter content
- [ ] View reading history
- [ ] Continue reading from history
- [ ] Increment views on chapter read

### Teams
- [ ] Create team
- [ ] Add team members
- [ ] Request to join team
- [ ] Approve/reject join requests
- [ ] Create team project
- [ ] View team projects

### Brainstorm
- [ ] Add ideas to brainstorm
- [ ] Vote on ideas
- [ ] Create tasks
- [ ] Update task status
- [ ] Add notes/comments
- [ ] Delete ideas/tasks

### Collaboration
- [ ] Send collaboration request
- [ ] View pending requests
- [ ] Approve collaboration request
- [ ] Reject collaboration request

---

## API Endpoints to Test

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Auth
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Projects
```bash
# Get all projects
curl http://localhost:5000/api/projects

# Create project
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Project","description":"Description"}'

# Get project by ID
curl http://localhost:5000/api/projects/1

# Update project
curl -X PUT http://localhost:5000/api/projects/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Delete project
curl -X DELETE http://localhost:5000/api/projects/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Chapters
```bash
# Get chapters by project
curl http://localhost:5000/api/chapters?projectId=1

# Create chapter
curl -X POST http://localhost:5000/api/chapters \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"project_id":1,"title":"Chapter 1","chapter_number":1}'

# Publish chapter
curl -X POST http://localhost:5000/api/chapters/1/publish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Common Issues & Solutions

### Issue: "Failed to resolve import"
**Solution**: Ensure all old imports from `utils/dataManager` are replaced with `apiClient`

### Issue: "Cannot read property 'data' of undefined"
**Solution**: Check API response structure - all responses should have `.data` property

### Issue: "401 Unauthorized"
**Solution**: Ensure JWT token is stored in localStorage and sent in Authorization header

### Issue: "CORS error"
**Solution**: Backend CORS is configured for `http://localhost:5173` - ensure frontend is running on this URL

### Issue: "Database connection failed"
**Solution**: Check `.env` file has correct Supabase connection string

---

## Field Name Mapping

When testing, remember the field name conversions:

| Frontend (camelCase) | Database/API (snake_case) |
|---|---|
| projectId | project_id |
| chapterId | chapter_id |
| userId | user_id |
| userName | user_name |
| initiatorId | initiator_id |
| isTeamProject | is_team_project |
| chapterNumber | chapter_number |
| isPublished | is_published |
| createdAt | created_at |
| updatedAt | updated_at |

---

## Performance Testing

### Build Size
```bash
npm run build
```
Current: ~1MB (uncompressed), ~306KB (gzipped)

### Bundle Analysis
```bash
npm run build -- --analyze
```

### Lighthouse Audit
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit for Performance, Accessibility, Best Practices, SEO

---

## Database Testing

### Connect to Supabase
```bash
# Using psql
psql postgresql://postgres.pcmxbqeaocatcfyrlczt:Binusian2026@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres

# List tables
\dt

# Query users
SELECT * FROM users;

# Query projects
SELECT * FROM projects;
```

---

## Debugging Tips

### Enable Debug Logging
Add to `src/api/client.js`:
```javascript
const DEBUG = true;

const makeRequest = async (method, endpoint, body = null, includeAuth = true) => {
  if (DEBUG) console.log(`[API] ${method} ${endpoint}`, body);
  // ... rest of function
};
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action
4. Check request/response headers and body

### Check LocalStorage
1. Open DevTools (F12)
2. Go to Application tab
3. Click LocalStorage
4. Check `authToken` is present after login

---

## Test Data

### Sample User
- Email: `test@example.com`
- Password: `password123`
- Name: `Test User`

### Sample Project
- Title: `My First Project`
- Description: `A test project`
- Status: `draft`

### Sample Chapter
- Title: `Chapter 1: Introduction`
- Chapter Number: `1`
- Content: `Lorem ipsum...`

---

## Continuous Testing

### Watch Mode
```bash
npm run dev
```
Frontend will auto-reload on file changes

### Backend Watch Mode
```bash
cd backend
npm run dev
```
Backend will auto-restart on file changes

---

## Deployment Testing

### Test Production Build
```bash
npm run build
npm run preview
```
This runs the production build locally for testing

### Environment Variables
Ensure `.env` file has:
```
VITE_API_URL=http://localhost:5000/api
```

For production:
```
VITE_API_URL=https://your-backend-url/api
```

---

## Success Criteria

✅ All components load without errors
✅ API calls return correct data
✅ User authentication works
✅ CRUD operations work for all entities
✅ Real-time updates work
✅ Error handling displays user-friendly messages
✅ Performance is acceptable (< 3s page load)
✅ No console errors or warnings

