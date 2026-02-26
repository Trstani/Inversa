# INVERSA Platform Optimization Guide

## Overview
INVERSA adalah platform collaborative writing yang telah dioptimalkan dengan struktur folder yang lebih scalable dan fitur-fitur kolaborasi yang lengkap.

## Struktur Folder yang Dioptimalkan

```
src/
├── InitiatorFolder/          # Untuk user yang membuat project
│   ├── InitiatorDashboard.jsx    # Dashboard untuk initiator
│   └── EditorPage.jsx            # Editor untuk membuat/edit chapter
├── CollaboratorFolder/       # Untuk user yang bergabung ke project
│   └── CollaboratorDashboard.jsx # Dashboard untuk collaborator
├── MainPage/
│   ├── ProjectDetail.jsx         # Detail page project (baru)
│   ├── Homepage.jsx
│   ├── Explore.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── components/
│   ├── CollaborationRequestModal.jsx  # Modal untuk request join (baru)
│   ├── Editor/
│   │   ├── CreateChapterModal.jsx     # Modal untuk create chapter (baru)
│   │   ├── EditorLayout.jsx
│   │   ├── EditorHeader.jsx
│   │   ├── EditorBody.jsx
│   │   └── ...
│   └── ...
├── context/
│   ├── AuthContext.jsx       # User authentication
│   └── ThemeContext.jsx
├── utils/
│   ├── dataManager.js        # Data management (projects, chapters, collaborations)
│   └── userManager.js        # User management
└── routes/
    └── AppRoutes.jsx         # Routing configuration
```

## Fitur-Fitur Utama

### 1. Initiator Dashboard (`/dashboard/initiator`)
**Untuk user yang membuat project**

Fitur:
- ✅ Lihat semua project yang dibuat
- ✅ Buat project baru dengan form
- ✅ Lihat collaboration requests dari collaborator
- ✅ Approve/Reject collaboration requests
- ✅ Delete project
- ✅ Edit project (via project detail)

Data yang dikelola:
- Project title, description, category, genre, status
- Collaboration requests (pending, approved, rejected)
- Project statistics (chapters, collaborators, likes)

### 2. Collaborator Dashboard (`/dashboard/collaborator`)
**Untuk user yang ingin bergabung ke project**

Fitur:
- ✅ Lihat project yang sudah diikuti
- ✅ Lihat pending collaboration requests
- ✅ Discover projects yang tersedia untuk join
- ✅ Search & filter projects by genre
- ✅ Cancel collaboration request
- ✅ Access editor untuk assigned chapters

### 3. Project Detail Page (`/project/:projectId`)
**Halaman detail project**

Fitur:
- ✅ Lihat informasi lengkap project
- ✅ Lihat daftar chapters
- ✅ Lihat daftar collaborators
- ✅ Request to join (untuk non-member)
- ✅ Go to editor (untuk member)
- ✅ Project statistics (chapters, collaborators, likes)

### 4. Text Editor (`/editor/:projectId/:chapterId?`)
**Editor untuk membuat/edit chapter**

Fitur:
- ✅ Create new chapter
- ✅ Edit chapter content
- ✅ Save as draft
- ✅ Publish chapter
- ✅ Navigate between chapters
- ✅ View chapter list sidebar

### 5. Collaboration System
**Sistem untuk manage kolaborasi**

Flow:
1. Collaborator request join ke project
2. Collaborator memilih role (writer, editor, illustrator, proofreader)
3. Initiator melihat request di dashboard
4. Initiator approve/reject request
5. Jika approved, collaborator dapat access editor
6. Initiator dapat assign collaborator ke specific chapters

## Routes Configuration

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

## Data Structure

### Project
```javascript
{
  id: number,
  title: string,
  description: string,
  category: string,           // novel, cerpen, blog, skenario
  genre: string,              // adventure, comedy, horror, romance, scifi
  initiatorId: number,        // User ID of project creator
  status: string,             // open, closed
  backgroundImage: string,    // Optional
  likes: number,
  totalChapters: number,
  collaborators: [
    {
      userId: number,
      role: string,           // writer, editor, illustrator, proofreader
      status: string,         // approved, pending, rejected
      assignedChapters: [number],
      joinedAt: string
    }
  ],
  createdAt: string,
  updatedAt: string
}
```

### Chapter
```javascript
{
  id: number,
  projectId: number,
  chapterNumber: number,
  title: string,
  content: string,
  authorId: number,
  status: string,             // draft, published
  comments: [
    {
      id: number,
      userId: number,
      userName: string,
      content: string,
      createdAt: string
    }
  ],
  createdAt: string,
  updatedAt: string
}
```

### Collaboration Request
```javascript
{
  id: number,
  projectId: number,
  userId: number,
  userName: string,
  requestedRole: string,      // writer, editor, illustrator, proofreader
  status: string,             // pending, approved, rejected, cancelled
  createdAt: string
}
```

## Key Functions in dataManager.js

### Projects
- `loadProjects()` - Get all projects
- `saveProject(project)` - Create/update project
- `deleteProject(id)` - Delete project
- `getProjectById(id)` - Get single project

### Chapters
- `loadChapters(projectId?)` - Get chapters
- `saveChapter(chapter)` - Create/update chapter
- `deleteChapter(id)` - Delete chapter
- `createNewChapter(projectId, chapterData)` - Create new chapter (NEW)

### Collaboration
- `loadCollaborationRequests(projectId?)` - Get requests
- `saveCollaborationRequest(request)` - Create request
- `updateCollaborationRequest(id, status, role)` - Approve/reject request
- `deleteCollaborationRequest(id)` - Delete request

## User Flows

### Flow 1: Initiator Creates Project
1. Login → Click "Create Project" → Go to `/dashboard/initiator`
2. Fill form (title, description, category, genre, status)
3. Click "Create Project"
4. Project appears in "My Projects" list
5. Can edit/delete project
6. Can view collaboration requests

### Flow 2: Collaborator Joins Project
1. Login → Click "Join Project" → Go to `/dashboard/collaborator`
2. Search/filter projects in "Discover Projects"
3. Click project card → Go to `/project/:projectId`
4. Click "Request to Join"
5. Select role (writer, editor, illustrator, proofreader)
6. Submit request
7. Wait for initiator approval
8. Once approved, can access editor

### Flow 3: Initiator Approves Collaborator
1. Go to `/dashboard/initiator`
2. See "Collaboration Requests" section
3. Click ✓ to approve or ✗ to reject
4. Approved collaborator can now access editor

### Flow 4: Edit Chapter in Editor
1. Go to `/editor/:projectId`
2. See chapter list in sidebar
3. Click chapter to select
4. Edit content in editor
5. Click "Save Draft" or "Publish"
6. Can create new chapter with + button

## Authentication & Authorization

- User must be logged in to access protected routes
- Initiator can only manage their own projects
- Collaborator can only access assigned chapters
- Only approved collaborators can access editor
- Initiator can approve/reject collaboration requests

## Data Persistence

- Uses localStorage as primary storage
- Falls back to API if available
- Data is automatically saved when modified
- All changes are persisted across sessions

## Styling

- Uses Tailwind CSS with dark mode support
- Light mode: light-primary, light-secondary, light-accent, light-surface, light-background
- Dark mode: dark-primary, dark-secondary, dark-accent, dark-surface, dark-background
- Responsive design (mobile, tablet, desktop)

## Next Steps for Enhancement

1. **Backend Integration**
   - Connect to real API server
   - Implement proper authentication (JWT)
   - Add database persistence

2. **Advanced Features**
   - Real-time collaboration (WebSocket)
   - Comments & discussions on chapters
   - Version history & rollback
   - Export to PDF/EPUB
   - Social features (follow, share, recommendations)

3. **Performance**
   - Implement pagination for large datasets
   - Add caching strategy
   - Optimize image loading
   - Lazy load chapters

4. **User Experience**
   - Add notifications for collaboration requests
   - Email notifications
   - Rich text editor enhancements
   - Keyboard shortcuts
   - Auto-save functionality
