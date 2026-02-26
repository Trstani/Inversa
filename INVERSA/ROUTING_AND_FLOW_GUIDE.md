# INVERSA Platform - Routing & Flow Guide

## 📍 Complete Routes Configuration

```javascript
// Public Routes
GET  /                    // Homepage
GET  /explore             // Explore projects
GET  /login               // Login page
GET  /register            // Register page

// Protected Routes
GET  /Home                // Home dashboard
GET  /dashboard/initiator // Initiator dashboard
GET  /dashboard/collaborator // Collaborator dashboard
GET  /project/:projectId  // Project detail
GET  /editor/:projectId/:chapterId? // Text editor
```

---

## 🔄 Complete User Flows

### Flow 1: Initiator Creates Project & Adds Chapters

```
1. Login
   ↓
2. Click "Create Project" button
   ↓
3. Navigate to /dashboard/initiator
   ↓
4. Fill form (title, description, category, genre, status)
   ↓
5. Click "Create Project"
   ↓
6. Project appears in "My Projects" list
   ↓
7. Click project card or "Go to Editor" button
   ↓
8. Navigate to /project/:projectId
   ↓
9. Click "Go to Editor" button
   ↓
10. Navigate to /editor/:projectId
    ↓
11. See empty chapter list with "+" button
    ↓
12. Click "+" button to create new chapter
    ↓
13. Modal appears: Enter chapter title & description
    ↓
14. Click "Create Chapter"
    ↓
15. New chapter created and selected
    ↓
16. Tiptap editor appears with empty content
    ↓
17. Write chapter content
    ↓
18. Click "Save Draft" or "Publish"
    ↓
19. Chapter saved with status (draft/published)
    ↓
20. Can create more chapters by clicking "+" again
    ↓
21. Can switch between chapters by clicking in sidebar
```

### Flow 2: Collaborator Joins Project

```
1. Login
   ↓
2. Click "Join Project" button
   ↓
3. Navigate to /dashboard/collaborator
   ↓
4. See "Discover Projects" section
   ↓
5. Search/filter projects
   ↓
6. Click project card
   ↓
7. Navigate to /project/:projectId
   ↓
8. Click "Request to Join" button
   ↓
9. Modal appears: Select role (writer, editor, illustrator, proofreader)
   ↓
10. Click "Send Request"
    ↓
11. Request sent to initiator
    ↓
12. Button changes to "Request Pending"
    ↓
13. Wait for initiator approval
```

### Flow 3: Initiator Approves Collaborator

```
1. Initiator goes to /dashboard/initiator
   ↓
2. See "Collaboration Requests" section
   ↓
3. See pending requests from collaborators
   ↓
4. Click ✓ button to approve
   ↓
5. Collaborator added to project
   ↓
6. Collaborator can now access editor
```

### Flow 4: Collaborator Edits Draft Chapter

```
1. Collaborator goes to /dashboard/collaborator
   ↓
2. See "My Projects" section (projects they joined)
   ↓
3. Click project card
   ↓
4. Navigate to /project/:projectId
   ↓
5. See chapters list
   ↓
6. Click "Read/Edit" button on draft chapter
   ↓
7. Navigate to /editor/:projectId/:chapterId
   ↓
8. See chapter content in Tiptap editor
   ↓
9. Can edit content (if draft)
   ↓
10. Cannot save/publish (only initiator can)
    ↓
11. Can view published chapters (read-only)
```

---

## 🎯 Component Data Flow

### EditorPage (Container)
```
EditorPage
├── Load project data
├── Load chapters for project
├── Check if user is initiator
├── Pass to EditorLayout
└── Handle save callback
```

### EditorLayout (Manager)
```
EditorLayout
├── Manage chapter creation modal
├── Handle create chapter
├── Handle delete chapter
├── Pass chapters to sidebar & body
└── Pass callbacks to children
```

### ChapterSidebar (Display)
```
ChapterSidebar
├── Display chapter list
├── Show chapter status (draft/published)
├── Show "+" button (only for initiator)
├── Show delete button (only for draft chapters)
└── Handle chapter selection
```

### EditorBody (Editor)
```
EditorBody
├── Display Tiptap editor
├── Display chapter title input
├── Display editor toolbar
├── Display chapter navigation
├── Display save/publish buttons (only for initiator)
└── Handle save callback
```

---

## 💾 Data Persistence Flow

### When Creating Chapter
```
1. User clicks "+" button
   ↓
2. Modal appears
   ↓
3. User enters title & description
   ↓
4. Click "Create Chapter"
   ↓
5. createNewChapter() called
   ↓
6. New chapter object created with:
   - id: Date.now()
   - projectId: current project
   - chapterNumber: auto-increment
   - status: 'draft'
   - content: empty
   ↓
7. Saved to localStorage
   ↓
8. Project totalChapters updated
   ↓
9. Chapter list refreshed
   ↓
10. New chapter selected
```

### When Saving Chapter
```
1. User clicks "Save Draft" or "Publish"
   ↓
2. handleSave() called with:
   - id: chapter id
   - title: chapter title
   - content: HTML from Tiptap
   - status: 'draft' or 'published'
   ↓
3. saveChapter() called
   ↓
4. Chapter updated in localStorage
   ↓
5. updatedAt timestamp set
   ↓
6. Chapters list reloaded
   ↓
7. Current chapter updated
   ↓
8. Success message shown
```

### When Deleting Chapter
```
1. User clicks delete button (only for draft)
   ↓
2. Confirmation dialog appears
   ↓
3. User confirms
   ↓
4. deleteChapter() called
   ↓
5. Chapter removed from localStorage
   ↓
6. Chapters list refreshed
   ↓
7. First remaining chapter selected
```

---

## 🔐 Authorization Rules

### Initiator Can:
- ✅ Create project
- ✅ Edit project details
- ✅ Delete project
- ✅ Create chapters
- ✅ Edit all chapters (draft & published)
- ✅ Publish chapters
- ✅ Delete draft chapters
- ✅ View collaboration requests
- ✅ Approve/reject collaborators
- ✅ Assign collaborators to chapters

### Collaborator Can:
- ✅ View project details
- ✅ View published chapters (read-only)
- ✅ Edit draft chapters (if assigned)
- ✅ Cannot create chapters
- ✅ Cannot publish chapters
- ✅ Cannot delete chapters
- ✅ Cannot manage collaborators

### Guest Can:
- ✅ View homepage
- ✅ View explore page
- ✅ View project details (public)
- ✅ Cannot access editor
- ✅ Cannot create/edit chapters

---

## 📊 State Management

### EditorPage State
```javascript
{
  project: Project | null,
  chapters: Chapter[],
  currentChapter: Chapter | null,
  loading: boolean,
  isInitiator: boolean
}
```

### EditorLayout State
```javascript
{
  showCreateModal: boolean
}
```

### EditorBody State
```javascript
{
  title: string,
  editor: TiptapEditor | null
}
```

---

## 🔧 Key Functions

### Chapter Management
- `loadChapters(projectId)` - Load all chapters for project
- `saveChapter(chapter)` - Save/update chapter
- `deleteChapter(id)` - Delete chapter
- `createNewChapter(projectId, data)` - Create new chapter

### Project Management
- `loadProjects()` - Load all projects
- `saveProject(project)` - Save/update project
- `deleteProject(id)` - Delete project
- `getProjectById(id)` - Get single project

### Collaboration
- `loadCollaborationRequests()` - Load all requests
- `saveCollaborationRequest(request)` - Create request
- `updateCollaborationRequest(id, status)` - Approve/reject

---

## ✅ Testing Checklist

### Chapter Creation
- [ ] Initiator can click "+" button
- [ ] Modal appears with title & description fields
- [ ] Chapter created with auto-increment number
- [ ] Chapter appears in sidebar
- [ ] Chapter selected automatically
- [ ] Can create multiple chapters

### Chapter Editing
- [ ] Tiptap editor loads with chapter content
- [ ] Title input works
- [ ] Content editing works
- [ ] Save Draft button works
- [ ] Publish button works
- [ ] Status updates correctly

### Chapter Navigation
- [ ] Can switch between chapters in sidebar
- [ ] Current chapter highlighted
- [ ] Content updates when switching
- [ ] Chapter number displays correctly

### Authorization
- [ ] Initiator can edit all chapters
- [ ] Collaborator cannot edit published chapters
- [ ] Collaborator cannot create chapters
- [ ] Collaborator cannot publish chapters
- [ ] Delete button only shows for draft chapters

### Data Persistence
- [ ] Chapters saved to localStorage
- [ ] Chapters persist after page refresh
- [ ] Chapter status (draft/published) persists
- [ ] Chapter content persists
- [ ] Chapter number persists

---

## 🐛 Common Issues & Solutions

### Issue: Chapter not appearing in sidebar
**Solution:** 
- Check if chapter was created successfully
- Verify projectId is correct
- Check localStorage for chapters data
- Reload page to refresh

### Issue: Tiptap editor not loading
**Solution:**
- Verify Tiptap is installed
- Check browser console for errors
- Ensure chapter data is loaded
- Try creating new chapter

### Issue: Save not working
**Solution:**
- Check if user is initiator
- Verify chapter has title
- Check browser console for errors
- Verify localStorage is available

### Issue: Collaborator cannot edit chapter
**Solution:**
- Verify collaborator is approved
- Check if chapter is draft
- Verify collaborator is assigned to chapter
- Check authorization logic

---

## 📝 Next Steps

1. **Test all flows** - Test complete user flows
2. **Fix any bugs** - Fix issues found during testing
3. **Add error handling** - Add better error messages
4. **Add notifications** - Add toast notifications for actions
5. **Add auto-save** - Implement auto-save functionality
6. **Add version history** - Track chapter versions
7. **Add comments** - Add chapter comments/discussions
8. **Backend integration** - Connect to real API
