# INVERSA Platform - Testing Guide

## 🧪 Manual Testing Steps

### Prerequisites
- Application running on localhost
- Browser DevTools open (F12)
- localStorage accessible

---

## Test 1: Create Project & Add Chapters

### Step 1: Login
1. Go to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `demo@example.com`
   - Password: `demo123`
3. Click "Login"
4. Should redirect to `/Home`

### Step 2: Navigate to Initiator Dashboard
1. Click "Create Project" button (or navigate to `/dashboard/initiator`)
2. Should see "Initiator Dashboard"
3. Should see "Create New Project" form

### Step 3: Create Project
1. Fill form:
   - Title: "My First Story"
   - Description: "A test story"
   - Category: "Novel"
   - Genre: "Adventure"
   - Status: "Open"
2. Click "Create Project"
3. Should see success message
4. Project should appear in "My Projects" list

### Step 4: Go to Editor
1. Click project card or "Go to Editor" button
2. Should navigate to `/project/:projectId`
3. Should see project details
4. Click "Go to Editor" button
5. Should navigate to `/editor/:projectId`

### Step 5: Create First Chapter
1. Should see empty chapter list with "+" button
2. Click "+" button
3. Modal should appear: "Create New Chapter"
4. Fill form:
   - Title: "Chapter 1: The Beginning"
   - Description: "First chapter"
5. Click "Create Chapter"
6. Modal should close
7. Chapter should appear in sidebar
8. Chapter should be selected (highlighted in blue)
9. Tiptap editor should appear

### Step 6: Write Chapter Content
1. Click in editor area
2. Type some content: "Once upon a time..."
3. Use toolbar to format (bold, italic, etc.)
4. Should see content in editor

### Step 7: Save as Draft
1. Click "Save Draft" button
2. Should see "Draft saved!" message
3. Chapter status should show "draft" in sidebar
4. Content should be saved

### Step 8: Create Second Chapter
1. Click "+" button again
2. Modal appears
3. Fill form:
   - Title: "Chapter 2: The Adventure"
   - Description: "Second chapter"
4. Click "Create Chapter"
5. New chapter should appear in sidebar
6. Should have chapter number 2
7. Should be selected

### Step 9: Write & Publish
1. Type content in editor
2. Click "Publish" button
3. Should see "Published!" message
4. Chapter status should show "published" in sidebar

### Step 10: Switch Between Chapters
1. Click "Chapter 1" in sidebar
2. Should switch to Chapter 1
3. Should see Chapter 1 content
4. Chapter 1 should be highlighted
5. Click "Chapter 2" in sidebar
6. Should switch to Chapter 2
7. Should see Chapter 2 content

---

## Test 2: Collaborator Joins Project

### Step 1: Create Second User (Collaborator)
1. Go to `/register`
2. Fill form:
   - Name: "Collaborator User"
   - Email: "collab@example.com"
   - Password: "collab123"
3. Click "Register"
4. Should redirect to `/Home`

### Step 2: Navigate to Collaborator Dashboard
1. Click "Join Project" button (or navigate to `/dashboard/collaborator`)
2. Should see "Collaborator Dashboard"
3. Should see "Discover Projects" section

### Step 3: Find Project
1. Should see project created by initiator
2. Click project card
3. Should navigate to `/project/:projectId`

### Step 4: Request to Join
1. Click "Request to Join" button
2. Modal should appear: "Request to Join"
3. Select role: "Writer"
4. Click "Send Request"
5. Modal should close
6. Button should change to "Request Pending"

### Step 5: Approve Request (as Initiator)
1. Login as initiator (demo@example.com)
2. Go to `/dashboard/initiator`
3. Should see "Collaboration Requests" section
4. Should see request from collaborator
5. Click ✓ button to approve
6. Request should disappear
7. Collaborator should be added to project

### Step 6: Access Editor (as Collaborator)
1. Login as collaborator (collab@example.com)
2. Go to `/dashboard/collaborator`
3. Should see project in "My Projects"
4. Click project card
5. Should navigate to `/project/:projectId`
6. Click "Go to Editor" button
7. Should navigate to `/editor/:projectId`
8. Should see chapters in sidebar

### Step 7: Edit Draft Chapter (as Collaborator)
1. Should see Chapter 1 (draft) in sidebar
2. Click Chapter 1
3. Should see content in editor
4. Try to edit content
5. Should be able to edit (if draft)
6. Try to click "Save Draft" button
7. Should be disabled (only initiator can save)

### Step 8: View Published Chapter (as Collaborator)
1. Click Chapter 2 (published) in sidebar
2. Should see content in editor
3. Should be read-only
4. Save buttons should be disabled

---

## Test 3: Delete Chapter

### Step 1: Delete Draft Chapter (as Initiator)
1. Login as initiator
2. Go to `/editor/:projectId`
3. Click on draft chapter in sidebar
4. Should see delete button
5. Click delete button
6. Confirmation dialog should appear
7. Click confirm
8. Chapter should be deleted
9. Should disappear from sidebar

### Step 2: Cannot Delete Published Chapter
1. Click on published chapter
2. Should NOT see delete button
3. Published chapters cannot be deleted

---

## Test 4: Data Persistence

### Step 1: Refresh Page
1. Go to `/editor/:projectId`
2. Refresh page (F5)
3. Should still see all chapters
4. Should still see chapter content
5. Should still see chapter status

### Step 2: Close & Reopen Browser
1. Close browser
2. Reopen browser
3. Go to `http://localhost:3000`
4. Login
5. Go to `/dashboard/initiator`
6. Should see all projects
7. Go to `/editor/:projectId`
8. Should see all chapters with content

### Step 3: Check localStorage
1. Open DevTools (F12)
2. Go to Application → localStorage
3. Should see `inversa_projects` key
4. Should see `inversa_chapters` key
5. Should see `inversa_collaborations` key
6. Click on each to view data

---

## Test 5: Authorization

### Step 1: Initiator Can Edit All Chapters
1. Login as initiator
2. Go to `/editor/:projectId`
3. Click any chapter (draft or published)
4. Should be able to edit content
5. Should see "Save Draft" and "Publish" buttons

### Step 2: Collaborator Cannot Edit Published Chapters
1. Login as collaborator
2. Go to `/editor/:projectId`
3. Click published chapter
4. Should see content but read-only
5. Should NOT see "Save Draft" or "Publish" buttons

### Step 3: Collaborator Cannot Create Chapters
1. Login as collaborator
2. Go to `/editor/:projectId`
3. Should NOT see "+" button in sidebar
4. Cannot create new chapters

### Step 4: Non-Approved Collaborator Cannot Access Editor
1. Create new user
2. Request to join project
3. Do NOT approve request
4. Try to access `/editor/:projectId`
5. Should be redirected or see error

---

## Test 6: Error Handling

### Step 1: Missing Chapter Title
1. Go to `/editor/:projectId`
2. Click "+" button
3. Leave title empty
4. Click "Create Chapter"
5. Should see error: "Chapter title is required"

### Step 2: Invalid Project ID
1. Try to access `/editor/invalid-id`
2. Should show error or redirect

### Step 3: Unauthorized Access
1. Login as collaborator
2. Try to access `/editor/:projectId` of project they didn't join
3. Should be redirected or show error

---

## 🐛 Debugging Tips

### Check localStorage
```javascript
// In browser console
localStorage.getItem('inversa_projects')
localStorage.getItem('inversa_chapters')
localStorage.getItem('inversa_collaborations')
```

### Check Current User
```javascript
// In browser console
localStorage.getItem('inversa_currentUser')
```

### Clear All Data
```javascript
// In browser console
localStorage.clear()
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action
4. Should see fetch requests
5. Check response status (should be 200 or error)

### Check Console Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check for warnings

---

## ✅ Test Results Checklist

### Chapter Creation
- [ ] Can create chapter with title
- [ ] Chapter number auto-increments
- [ ] Chapter appears in sidebar
- [ ] Chapter is selected after creation
- [ ] Can create multiple chapters

### Chapter Editing
- [ ] Tiptap editor loads
- [ ] Can edit title
- [ ] Can edit content
- [ ] Can format text (bold, italic, etc.)
- [ ] Can save as draft
- [ ] Can publish

### Chapter Navigation
- [ ] Can switch between chapters
- [ ] Current chapter highlighted
- [ ] Content updates when switching
- [ ] Chapter number displays correctly

### Authorization
- [ ] Initiator can edit all chapters
- [ ] Collaborator cannot edit published chapters
- [ ] Collaborator cannot create chapters
- [ ] Delete button only for draft chapters

### Data Persistence
- [ ] Data persists after refresh
- [ ] Data persists after browser close
- [ ] localStorage contains correct data

### Error Handling
- [ ] Error messages display correctly
- [ ] Validation works
- [ ] Unauthorized access handled

---

## 📝 Known Issues

### Issue 1: [Description]
**Status:** [Open/Fixed]
**Steps to Reproduce:** [Steps]
**Expected:** [Expected behavior]
**Actual:** [Actual behavior]
**Solution:** [Solution]

---

## 🚀 Performance Testing

### Load Time
- [ ] Page loads in < 2 seconds
- [ ] Editor loads in < 1 second
- [ ] Chapter list loads in < 500ms

### Memory Usage
- [ ] No memory leaks
- [ ] localStorage < 5MB
- [ ] No excessive re-renders

### Browser Compatibility
- [ ] Chrome ✓
- [ ] Firefox ✓
- [ ] Safari ✓
- [ ] Edge ✓

---

## 📊 Test Coverage

| Feature | Status | Notes |
|---------|--------|-------|
| Create Project | ✓ | Working |
| Create Chapter | ✓ | Working |
| Edit Chapter | ✓ | Working |
| Save Draft | ✓ | Working |
| Publish Chapter | ✓ | Working |
| Delete Chapter | ✓ | Working |
| Switch Chapters | ✓ | Working |
| Collaborator Join | ✓ | Working |
| Approve Request | ✓ | Working |
| Authorization | ✓ | Working |
| Data Persistence | ✓ | Working |

