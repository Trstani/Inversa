# INVERSA Platform - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- npm or yarn installed
- Browser with localStorage support

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Application will be available at http://localhost:5173 (or similar)
```

---

## 📱 Quick Navigation

### Public Pages
- **Homepage:** `http://localhost:5173/`
- **Explore:** `http://localhost:5173/explore`
- **Login:** `http://localhost:5173/login`
- **Register:** `http://localhost:5173/register`

### Protected Pages (Login Required)
- **Home:** `http://localhost:5173/Home`
- **Initiator Dashboard:** `http://localhost:5173/dashboard/initiator`
- **Collaborator Dashboard:** `http://localhost:5173/dashboard/collaborator`
- **Project Detail:** `http://localhost:5173/project/:projectId`
- **Editor:** `http://localhost:5173/editor/:projectId`

---

## 👤 Demo Credentials

### Initiator User
```
Email: demo@example.com
Password: demo123
```

### Create New Collaborator
1. Go to `/register`
2. Fill form with any credentials
3. Click "Register"

---

## 📖 Complete User Flow

### 1. Login as Initiator
```
1. Go to http://localhost:5173/login
2. Enter: demo@example.com / demo123
3. Click "Login"
4. Redirected to /Home
```

### 2. Create Project
```
1. Click "Create Project" button
2. Go to /dashboard/initiator
3. Fill form:
   - Title: "My Story"
   - Description: "A great story"
   - Category: "Novel"
   - Genre: "Adventure"
   - Status: "Open"
4. Click "Create Project"
5. Project appears in list
```

### 3. Add Chapters
```
1. Click project card
2. Go to /project/:projectId
3. Click "Go to Editor"
4. Go to /editor/:projectId
5. Click "+" button in sidebar
6. Enter chapter title
7. Click "Create Chapter"
8. Write content in Tiptap editor
9. Click "Save Draft" or "Publish"
10. Repeat for more chapters
```

### 4. Invite Collaborator
```
1. Go to /dashboard/initiator
2. See "Collaboration Requests" section
3. Wait for collaborator to request join
4. Click ✓ to approve
5. Collaborator can now access editor
```

### 5. Collaborator Joins
```
1. Login as collaborator
2. Go to /dashboard/collaborator
3. Find project in "Discover Projects"
4. Click project card
5. Click "Request to Join"
6. Select role (Writer, Editor, etc.)
7. Click "Send Request"
8. Wait for approval
9. Once approved, can access editor
```

---

## 🎯 Key Features

### For Initiator
- ✅ Create projects
- ✅ Create chapters
- ✅ Edit chapters
- ✅ Save as draft
- ✅ Publish chapters
- ✅ Delete draft chapters
- ✅ Manage collaborators
- ✅ Approve/reject requests

### For Collaborator
- ✅ Browse projects
- ✅ Request to join
- ✅ View chapters
- ✅ Edit draft chapters (if assigned)
- ✅ View published chapters

---

## 💾 Data Storage

All data is stored in **localStorage**:
- `inversa_projects` - All projects
- `inversa_chapters` - All chapters
- `inversa_collaborations` - Collaboration requests
- `inversa_users` - User accounts
- `inversa_currentUser` - Current logged-in user

### View Data in Browser
```javascript
// Open browser console (F12)
// View projects
JSON.parse(localStorage.getItem('inversa_projects'))

// View chapters
JSON.parse(localStorage.getItem('inversa_chapters'))

// View collaborations
JSON.parse(localStorage.getItem('inversa_collaborations'))

// Clear all data
localStorage.clear()
```

---

## 🔧 Troubleshooting

### Issue: Cannot create chapter
**Solution:**
1. Make sure you're logged in as initiator
2. Make sure you're in the editor page
3. Check browser console for errors
4. Try refreshing the page

### Issue: Chapter not saving
**Solution:**
1. Make sure you have a title
2. Check if you're the initiator
3. Check browser console for errors
4. Verify localStorage is enabled

### Issue: Cannot see chapters
**Solution:**
1. Make sure you're in the correct project
2. Try refreshing the page
3. Check localStorage data
4. Try clearing localStorage and starting over

### Issue: Collaborator cannot access editor
**Solution:**
1. Make sure request is approved
2. Make sure collaborator is logged in
3. Try refreshing the page
4. Check if collaborator is in project.collaborators

---

## 📊 Project Structure

```
src/
├── InitiatorFolder/
│   ├── EditorPage.jsx          # Editor container
│   ├── InitiatorDashboard.jsx  # Dashboard
│   ├── components/             # Dashboard components
│   └── hooks/                  # Custom hooks
├── CollaboratorFolder/
│   └── CollaboratorDashboard.jsx
├── MainPage/
│   ├── ProjectDetail.jsx       # Project detail page
│   ├── Homepage.jsx
│   ├── Explore.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── components/
│   ├── Editor/                 # Editor components
│   │   ├── EditorLayout.jsx
│   │   ├── EditorBody.jsx
│   │   ├── EditorActions.jsx
│   │   ├── ChapterSidebar.jsx
│   │   └── ...
│   └── ...
├── context/
│   ├── AuthContext.jsx         # Authentication
│   └── ThemeContext.jsx        # Theme
├── utils/
│   ├── dataManager.js          # Data management
│   └── userManager.js          # User management
└── routes/
    └── AppRoutes.jsx           # Routing
```

---

## 🔐 Authentication

### Login Flow
```
1. User enters email & password
2. loginUser() validates credentials
3. User object stored in localStorage
4. Redirected to /Home
5. Protected routes check authentication
```

### Protected Routes
- Require user to be logged in
- Redirect to /login if not authenticated
- Check user role for authorization

---

## 📝 API Endpoints (Future)

Currently using localStorage. When backend is ready:

```
POST   /api/projects              # Create project
GET    /api/projects              # Get all projects
GET    /api/projects/:id          # Get project
PUT    /api/projects/:id          # Update project
DELETE /api/projects/:id          # Delete project

POST   /api/chapters              # Create chapter
GET    /api/chapters              # Get chapters
PUT    /api/chapters/:id          # Update chapter
DELETE /api/chapters/:id          # Delete chapter

POST   /api/collaborations        # Request join
GET    /api/collaborations        # Get requests
PUT    /api/collaborations/:id    # Approve/reject
DELETE /api/collaborations/:id    # Delete request
```

---

## 🎨 Styling

### Tailwind CSS Classes
- Light mode: `light-primary`, `light-secondary`, `light-accent`, `light-surface`, `light-background`
- Dark mode: `dark-primary`, `dark-secondary`, `dark-accent`, `dark-surface`, `dark-background`

### Dark Mode Toggle
- Implemented via ThemeContext
- Toggle in Header component

---

## 🧪 Testing

### Manual Testing
See `TESTING_GUIDE.md` for detailed testing steps

### Quick Test
1. Create project
2. Add chapter
3. Write content
4. Save draft
5. Publish
6. Create another chapter
7. Switch between chapters
8. Verify data persists after refresh

---

## 📚 Documentation

- **FIXES_SUMMARY.md** - All fixes applied
- **ROUTING_AND_FLOW_GUIDE.md** - Complete routing & flows
- **TESTING_GUIDE.md** - Testing steps & checklist
- **ANALYSIS_AND_FIXES.md** - Detailed analysis

---

## 🚀 Next Steps

1. ✅ Test all features
2. ✅ Verify data persistence
3. ✅ Check authorization
4. ⏳ Add backend integration
5. ⏳ Add real-time collaboration
6. ⏳ Add notifications
7. ⏳ Add advanced features

---

## 💡 Tips

### Keyboard Shortcuts (Future)
- `Ctrl+S` - Save draft
- `Ctrl+P` - Publish
- `Ctrl+N` - New chapter
- `Ctrl+D` - Delete chapter

### Browser DevTools
- F12 - Open DevTools
- Application → localStorage - View data
- Console - Check errors
- Network - Check requests

### Performance
- localStorage is fast for small datasets
- Consider pagination for large projects
- Use React.memo for optimization
- Lazy load chapters

---

## 📞 Support

### Common Issues
1. **Cannot login** - Check credentials, try register
2. **Cannot create chapter** - Make sure you're initiator
3. **Data not saving** - Check localStorage, try refresh
4. **Cannot see chapters** - Try refresh, check project ID

### Debug Mode
```javascript
// In browser console
localStorage.setItem('debug', 'true')
// Will log all data operations
```

---

## ✨ Summary

INVERSA Platform is now fully functional with:
- ✅ Project creation & management
- ✅ Chapter creation & editing
- ✅ Tiptap rich text editor
- ✅ Draft & publish functionality
- ✅ Collaboration system
- ✅ Authorization & access control
- ✅ Data persistence
- ✅ Responsive design

Ready to test and deploy! 🎉
