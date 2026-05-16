# Developer Quick Reference - INVERSA Project

**Last Updated**: May 15, 2026

---

## Quick Start

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

### 2. Start Frontend
```bash
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## Project Structure

```
INVERSA/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── routes/                  # 8 API route files
│   ├── services/                # 9 service files (93 functions)
│   ├── scripts/
│   │   └── setup-database.js    # Database setup
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env                     # Backend environment variables
│
├── src/
│   ├── api/
│   │   └── client.js            # API client (50+ methods)
│   ├── components/              # React components
│   ├── context/                 # React context (Auth, Theme)
│   ├── pages/                   # Page components
│   ├── routes/                  # Route definitions
│   ├── utils/
│   │   └── apiTransformer.js    # Field name conversion
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env                         # Frontend environment variables
├── package.json
├── vite.config.js
├── tailwind.config.js
└── eslint.config.js
```

---

## Environment Variables

### Backend (.env)
```
# Database
DATABASE_URL=postgresql://...
DB_HOST=...
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=...

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## API Client Usage

### Import
```javascript
import { apiClient } from '../api/client';
```

### Examples

#### Get All Projects
```javascript
const response = await apiClient.projects.getAll();
const projects = response.data;
```

#### Create Project
```javascript
const response = await apiClient.projects.create({
  title: 'My Project',
  description: 'Description',
  category: 'fiction',
  genre: 'fantasy'
});
const newProject = response.data;
```

#### Get User
```javascript
const response = await apiClient.users.getById(userId);
const user = response.data;
```

#### Like Project
```javascript
await apiClient.projects.incrementLikes(projectId);
```

#### Get Reading History
```javascript
const response = await apiClient.readingHistory.getHistory();
const history = response.data;
```

---

## Common Patterns

### Fetching Data in Component
```javascript
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

export function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.projects.getAll();
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* render data */}</div>;
}
```

### Form Submission
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await apiClient.projects.create(formData);
    alert('Success!');
    // Reset form or redirect
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

### Using Auth Context
```javascript
import { useAuth } from '../context/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

---

## Field Name Mapping

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
| backgroundImage | background_image |
| teamId | team_id |
| isHidden | is_hidden |

---

## API Response Format

### Success Response
```javascript
{
  success: true,
  data: { /* actual data */ },
  message: "Operation successful"
}
```

### Error Response
```javascript
{
  success: false,
  error: "Error message",
  message: "Error message"
}
```

---

## Common API Methods

### Projects
```javascript
apiClient.projects.getAll()
apiClient.projects.getById(id)
apiClient.projects.getPublished()
apiClient.projects.create(data)
apiClient.projects.update(id, data)
apiClient.projects.delete(id)
apiClient.projects.incrementLikes(id)
apiClient.projects.decrementLikes(id)
apiClient.projects.incrementViews(id)
apiClient.projects.hide(id)
apiClient.projects.unhide(id)
```

### Users
```javascript
apiClient.users.getAll()
apiClient.users.getById(id)
apiClient.users.update(id, data)
apiClient.users.follow(id)
apiClient.users.unfollow(id)
apiClient.users.getFollowers(id)
apiClient.users.getFollowing(id)
```

### Chapters
```javascript
apiClient.chapters.getAll()
apiClient.chapters.getById(id)
apiClient.chapters.getByProject(projectId)
apiClient.chapters.create(data)
apiClient.chapters.update(id, data)
apiClient.chapters.delete(id)
apiClient.chapters.publish(id)
apiClient.chapters.unpublish(id)
apiClient.chapters.lock(id)
apiClient.chapters.unlock(id)
```

### Teams
```javascript
apiClient.teams.getAll()
apiClient.teams.getById(id)
apiClient.teams.create(data)
apiClient.teams.update(id, data)
apiClient.teams.delete(id)
apiClient.teams.getMembers(id)
apiClient.teams.addMember(id, data)
apiClient.teams.removeMember(id, userId)
apiClient.teams.requestJoin(id)
apiClient.teams.approveMember(id, data)
apiClient.teams.rejectMember(id, data)
```

### Brainstorm
```javascript
apiClient.brainstorm.getSession(projectId)
apiClient.brainstorm.getIdeas(projectId)
apiClient.brainstorm.addIdea(projectId, data)
apiClient.brainstorm.deleteIdea(projectId, ideaId)
apiClient.brainstorm.voteIdea(projectId, ideaId)
apiClient.brainstorm.getTasks(projectId)
apiClient.brainstorm.addTask(projectId, data)
apiClient.brainstorm.updateTask(projectId, taskId, data)
apiClient.brainstorm.deleteTask(projectId, taskId)
apiClient.brainstorm.getComments(projectId, ideaId)
apiClient.brainstorm.addComment(projectId, ideaId, data)
apiClient.brainstorm.deleteComment(projectId, ideaId, commentId)
```

### Reading History
```javascript
apiClient.readingHistory.getHistory()
apiClient.readingHistory.getContinueReading()
apiClient.readingHistory.getProjectHistory(projectId)
apiClient.readingHistory.save(data)
apiClient.readingHistory.delete(projectId, chapterId)
apiClient.readingHistory.clearAll()
```

---

## Debugging

### Enable API Logging
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
4. Check request/response

### Check LocalStorage
1. Open DevTools (F12)
2. Go to Application tab
3. Click LocalStorage
4. Check `authToken` and `theme`

### Check Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors or warnings

---

## Testing

### Run Build
```bash
npm run build
```

### Run Preview
```bash
npm run preview
```

### Run Tests (when available)
```bash
npm run test
```

### Run E2E Tests (when available)
```bash
npm run test:e2e
```

---

## Common Issues & Solutions

### Issue: "Failed to resolve import"
**Solution**: Check import path is correct and file exists

### Issue: "Cannot read property 'data' of undefined"
**Solution**: Check API response has `.data` property

### Issue: "401 Unauthorized"
**Solution**: Ensure JWT token is in localStorage and sent in headers

### Issue: "CORS error"
**Solution**: Backend CORS is configured for `http://localhost:5173`

### Issue: "Database connection failed"
**Solution**: Check `.env` file has correct connection string

### Issue: "Build fails"
**Solution**: Run `npm install` and check for TypeScript errors

---

## Git Workflow

### Create Feature Branch
```bash
git checkout -b feature/feature-name
```

### Commit Changes
```bash
git add .
git commit -m "feat: description of changes"
```

### Push to Remote
```bash
git push origin feature/feature-name
```

### Create Pull Request
```bash
gh pr create --title "Feature: description" --body "Details"
```

### Merge to Main
```bash
git checkout main
git pull origin main
git merge feature/feature-name
git push origin main
```

---

## Deployment

### Deploy Backend to Render
1. Push to GitHub
2. Connect Render to GitHub
3. Set environment variables
4. Deploy

### Deploy Frontend to Vercel
1. Push to GitHub
2. Connect Vercel to GitHub
3. Set environment variables
4. Deploy

---

## Performance Tips

### Optimize Components
- Use `React.memo()` for expensive components
- Use `useCallback()` for event handlers
- Use `useMemo()` for expensive calculations

### Optimize API Calls
- Cache responses when possible
- Batch requests
- Use pagination for large datasets

### Optimize Bundle
- Use code splitting
- Lazy load routes
- Remove unused dependencies

---

## Security Tips

### Protect Sensitive Data
- Never commit `.env` files
- Never log sensitive data
- Use HTTPS in production

### Validate Input
- Validate on frontend
- Validate on backend
- Sanitize user input

### Secure API Calls
- Use JWT tokens
- Validate tokens on backend
- Use HTTPS only

---

## Resources

### Documentation
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Express Docs](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

### Tools
- [VS Code](https://code.visualstudio.com)
- [Postman](https://www.postman.com)
- [GitHub Desktop](https://desktop.github.com)
- [DevTools](https://developer.chrome.com/docs/devtools)

---

## Useful Commands

### Frontend
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
```

### Backend
```bash
npm install              # Install dependencies
npm run dev             # Start dev server with nodemon
npm run start           # Start production server
npm run test            # Run tests (when available)
```

### Database
```bash
# Connect to Supabase
psql postgresql://...

# List tables
\dt

# Query data
SELECT * FROM users;
```

---

## Contact & Support

### Team
- **Backend Lead**: [Name]
- **Frontend Lead**: [Name]
- **QA Lead**: [Name]
- **DevOps**: [Name]

### Communication
- **Slack**: #inversa-dev
- **Email**: dev@inversa.com
- **GitHub**: github.com/inversa/inversa

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 15, 2026 | Initial release |

---

**Last Updated**: May 15, 2026
**Status**: ACTIVE ✅

