# Phase 4 Quick Reference Guide

## 🚀 Quick Start for Updating Components

### Step 1: Replace Imports
```javascript
// ❌ OLD
import { getProjectById, loadChapters } from "../utils/dataManager/index";
import { findUserById } from "../utils/userManager/index";

// ✅ NEW
import { apiClient } from "../api/client";
```

### Step 2: Replace API Calls
```javascript
// ❌ OLD
const project = await getProjectById(id);
const chapters = await loadChapters(projectId);
const user = findUserById(userId);

// ✅ NEW
const projectResponse = await apiClient.projects.getById(id);
const project = projectResponse.data;

const chaptersResponse = await apiClient.chapters.getByProject(projectId);
const chapters = chaptersResponse.data;

const userResponse = await apiClient.users.getById(userId);
const user = userResponse.data;
```

### Step 3: Update Field Names
```javascript
// ❌ OLD
project.initiatorId
project.isTeamProject
project.backgroundImage
chapter.chapterNumber

// ✅ NEW
project.initiator_id
project.is_team_project
project.background_image
chapter.chapter_number
```

### Step 4: Add Error Handling
```javascript
try {
  const response = await apiClient.method();
  if (response.success && response.data) {
    // Use response.data
  } else {
    console.error('API Error:', response.error);
  }
} catch (error) {
  console.error('Error:', error);
}
```

---

## 📚 API Client Methods Reference

### Auth
```javascript
apiClient.auth.register({ name, email, password })
apiClient.auth.login({ email, password })
```

### Users
```javascript
apiClient.users.getAll()
apiClient.users.getById(id)
apiClient.users.update(id, data)
apiClient.users.delete(id)
apiClient.users.follow(followingId)
apiClient.users.unfollow(followingId)
```

### Projects
```javascript
apiClient.projects.getAll(filters)
apiClient.projects.getById(id)
apiClient.projects.getPublished()
apiClient.projects.create(data)
apiClient.projects.update(id, data)
apiClient.projects.delete(id)
apiClient.projects.incrementViews(id)
apiClient.projects.incrementLikes(id)
apiClient.projects.decrementLikes(id)
```

### Chapters
```javascript
apiClient.chapters.getAll(filters)
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

### Sections
```javascript
apiClient.sections.getAll(filters)
apiClient.sections.getById(id)
apiClient.sections.getByChapter(chapterId)
apiClient.sections.create(data)
apiClient.sections.update(id, data)
apiClient.sections.delete(id)
```

### Teams
```javascript
apiClient.teams.getAll()
apiClient.teams.getById(id)
apiClient.teams.getUserTeams(userId)
apiClient.teams.create(data)
apiClient.teams.update(id, data)
apiClient.teams.delete(id)
apiClient.teams.getMembers(id)
apiClient.teams.addMember(id, data)
apiClient.teams.removeMember(id, userId)
apiClient.teams.requestJoin(id)
apiClient.teams.approveMember(id, data)
apiClient.teams.rejectMember(id, data)
apiClient.teams.getPendingRequests(id)
apiClient.teams.getProjects(id)
```

### Brainstorm
```javascript
apiClient.brainstorm.getSession(projectId)
apiClient.brainstorm.getIdeas(projectId)
apiClient.brainstorm.addIdea(projectId, data)
apiClient.brainstorm.deleteIdea(projectId, ideaId)
apiClient.brainstorm.voteIdea(projectId, ideaId)
apiClient.brainstorm.unvoteIdea(projectId, ideaId)
apiClient.brainstorm.getTasks(projectId)
apiClient.brainstorm.addTask(projectId, data)
apiClient.brainstorm.updateTask(projectId, taskId, data)
apiClient.brainstorm.deleteTask(projectId, taskId)
apiClient.brainstorm.getComments(projectId, ideaId)
apiClient.brainstorm.addComment(projectId, ideaId, data)
apiClient.brainstorm.deleteComment(projectId, ideaId, commentId)
```

### Collaboration
```javascript
apiClient.collaboration.getRequests(filters)
apiClient.collaboration.getProjectRequests(projectId)
apiClient.collaboration.getUserRequests(userId)
apiClient.collaboration.createRequest(data)
apiClient.collaboration.updateRequest(id, data)
apiClient.collaboration.deleteRequest(id)
apiClient.collaboration.approve(id)
apiClient.collaboration.reject(id)
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

### Reports
```javascript
apiClient.reports.getAll(filters)
apiClient.reports.getById(id)
apiClient.reports.getProjectReports(projectId)
apiClient.reports.create(projectId, data)
apiClient.reports.updateStatus(id, data)
apiClient.reports.delete(id)
```

---

## 🔄 Field Name Mapping

### Projects
| Old | New |
|-----|-----|
| `initiatorId` | `initiator_id` |
| `isTeamProject` | `is_team_project` |
| `teamId` | `team_id` |
| `backgroundImage` | `background_image` |
| `category` | `category_id` |
| `genre` | `genre_id` |
| `collaborators` | `collaborators` |
| `likes` | `likes` |
| `views` | `views` |

### Chapters
| Old | New |
|-----|-----|
| `projectId` | `project_id` |
| `chapterNumber` | `chapter_number` |
| `isPublished` | `is_published` |
| `isLocked` | `is_locked` |
| `status` | `status` |

### Sections
| Old | New |
|-----|-----|
| `chapterId` | `chapter_id` |
| `sectionType` | `section_type` |
| `content` | `content` |

### Teams
| Old | New |
|-----|-----|
| `createdBy` | `created_by` |
| `teamId` | `team_id` |
| `userId` | `user_id` |
| `collaborators` | `members` |

### Brainstorm
| Old | New |
|-----|-----|
| `projectId` | `project_id` |
| `ideaId` | `idea_id` |
| `taskId` | `task_id` |
| `userId` | `user_id` |

---

## 📋 Component Update Checklist

For each component, follow this checklist:

- [ ] **Step 1: Backup** - Save original file
- [ ] **Step 2: Replace Imports** - Remove old utils, add apiClient
- [ ] **Step 3: Update API Calls** - Replace all data manager calls
- [ ] **Step 4: Update Field Names** - Replace camelCase with snake_case
- [ ] **Step 5: Add Error Handling** - Wrap API calls in try/catch
- [ ] **Step 6: Test Rendering** - Verify component renders
- [ ] **Step 7: Test API Calls** - Verify API calls work
- [ ] **Step 8: Test Data Display** - Verify data displays correctly
- [ ] **Step 9: Check Console** - Verify no errors
- [ ] **Step 10: Commit** - Commit changes

---

## 🎯 Priority Components

### Phase 4A: Core Features (5 components)
1. ✅ AuthContext
2. ✅ useUserDashboard
3. ✅ CardProject
4. ✅ ProjectDetail
5. ⏳ ChapterReader (NEXT)

### Phase 4B: Supporting Features (8 components)
6. EditorLayout
7. BrainstormGridLayout
8. TeamDetailPage
9. ProjectsExplorer
10. CreateTeamModal
11. CollaborationRequestModal
12. CardProjectMini
13. MyProjectsSection

### Phase 4C: Remaining Components (17+ components)
14. MyTeamsSection
15. AvailableTeamsSection
16. ChapterList
17. ChapterNavigation
18. EditorPage
19. CreateChapterModal
20. EditorBody
21. ImageSection
22. TextEditorSection
23. StoryIdeaSection
24. TaskManagerSection
25. DiscussionPanel
26. NotesPanel
27. ContributionPanel
28. CollaborationRequest
29. HistoryProjectItem
30. HistoryList
31. ReportsModal
32. Home
33. Recommendation

---

## 🧪 Testing Template

```javascript
// Test component rendering
test('Component renders without errors', () => {
  render(<Component />);
  expect(screen.getByText(/expected text/i)).toBeInTheDocument();
});

// Test API calls
test('API calls are made correctly', async () => {
  const { getByText } = render(<Component />);
  await waitFor(() => {
    expect(getByText(/loaded data/i)).toBeInTheDocument();
  });
});

// Test error handling
test('Error handling works', async () => {
  // Mock API error
  apiClient.method.mockRejectedValue(new Error('API Error'));
  render(<Component />);
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot read property 'data' of undefined"
**Solution**: Check if API response has `success` flag
```javascript
if (response.success && response.data) {
  // Use response.data
}
```

### Issue: Field names not matching
**Solution**: Use snake_case for API fields, camelCase for React
```javascript
// ❌ WRONG
project.initiatorId  // API returns initiator_id

// ✅ RIGHT
project.initiator_id
```

### Issue: API calls not working
**Solution**: Check if token is set
```javascript
import { setAuthToken } from '@/api/client';
setAuthToken(token);
```

### Issue: Component not updating after API call
**Solution**: Use setState or useState
```javascript
const [data, setData] = useState(null);
const response = await apiClient.method();
setData(response.data);
```

---

## 📞 Quick Help

### Need to find a component?
Use the file search in VS Code: `Ctrl+P` or `Cmd+P`

### Need to find an API method?
Check `src/api/client.js` for all available methods

### Need field name mapping?
See "Field Name Mapping" section above

### Need error handling pattern?
See "Step 4: Add Error Handling" section above

---

## ✅ Success Criteria

A component is successfully updated when:
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ All imports resolved
- ✅ All API calls valid
- ✅ Component renders
- ✅ Data displays correctly
- ✅ No console errors
- ✅ Error handling works

---

**Last Updated**: May 15, 2026
**Status**: Ready for use
**Version**: 1.0

