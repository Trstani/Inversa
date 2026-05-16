# INVERSA Platform - Alignment Fixes Required

## Summary
Identified **12 critical field name and structure mismatches** between frontend localStorage, backend API, and database schema that must be fixed for seamless integration.

---

## CRITICAL MISMATCHES

### 1. **Sections: `order` vs `section_order` vs `section_number`**
- **Database**: Uses `section_order` (INTEGER)
- **Frontend**: Uses `order` (in sectionManager.js)
- **Backend**: Uses `section_number` (in sections.js)
- **Impact**: Section ordering will fail; data won't sync
- **Fix**: Standardize to `section_number` across all layers

### 2. **User Profile Image: `avatar` vs `profile_image`**
- **Database**: Uses `profile_image` (TEXT)
- **Frontend**: Uses `avatar` (in userStorage.js)
- **Backend**: Uses `profile_image` (in users.js)
- **Impact**: User profile images won't load from database
- **Fix**: Change frontend to use `profile_image`

### 3. **Projects: `hasPublishedChapters` vs `has_published_chapters`**
- **Database**: Uses `has_published_chapters` (BOOLEAN)
- **Frontend**: Uses `hasPublishedChapters` (camelCase in projectManager.js)
- **Backend**: Uses `has_published_chapters` (snake_case)
- **Impact**: Published project filtering won't work correctly
- **Fix**: Frontend should use snake_case for API responses, convert to camelCase for internal use

### 4. **Projects: `totalChapters` vs `total_chapters`**
- **Database**: Uses `total_chapters` (INTEGER)
- **Frontend**: Uses `totalChapters` (camelCase)
- **Backend**: Uses `total_chapters` (snake_case)
- **Impact**: Chapter count won't sync with database
- **Fix**: Standardize naming convention

### 5. **Projects: `isTeamProject` vs `is_team_project`**
- **Database**: Uses `is_team_project` (BOOLEAN)
- **Frontend**: Uses `isTeamProject` (camelCase)
- **Backend**: Uses `is_team_project` (snake_case)
- **Impact**: Team project detection will fail
- **Fix**: Standardize naming convention

### 6. **Chapters: `chapterNumber` vs `chapter_number`**
- **Database**: Uses `chapter_number` (INTEGER)
- **Frontend**: Uses `chapterNumber` (camelCase)
- **Backend**: Uses `chapter_number` (snake_case)
- **Impact**: Chapter ordering will be inconsistent
- **Fix**: Standardize naming convention

### 7. **Chapters: `projectId` vs `project_id`**
- **Database**: Uses `project_id` (INTEGER FK)
- **Frontend**: Uses `projectId` (camelCase)
- **Backend**: Uses `project_id` (snake_case)
- **Impact**: Chapter-project relationships won't work
- **Fix**: Standardize naming convention

### 8. **Sections: `chapterId` vs `chapter_id`**
- **Database**: Uses `chapter_id` (INTEGER FK)
- **Frontend**: Uses `chapterId` (camelCase)
- **Backend**: Uses `chapter_id` (snake_case)
- **Impact**: Section-chapter relationships won't work
- **Fix**: Standardize naming convention

### 9. **Brainstorm: Duplicate Storage Keys**
- **Frontend**: Uses BOTH `inversa_brainstormSessions` AND `inversa_brainstorms`
- **Database**: Single `brainstorms` table
- **Backend**: Uses `brainstorms` table
- **Impact**: Data inconsistency; duplicate storage
- **Fix**: Consolidate to single `brainstormSessions` key

### 10. **Sections: Missing Fields in Frontend**
- **Database**: Has `image_url`, `caption`, `type` fields
- **Frontend**: Only has `content`, `order`, `assignedTo`, `status`
- **Backend**: Has `type`, `image_url`, `caption`
- **Impact**: Image sections won't work; missing fields
- **Fix**: Add `image_url`, `caption`, `type` to frontend sectionManager

### 11. **Sections: Extra Fields in Frontend**
- **Frontend**: Has `assignedTo`, `status` fields
- **Database**: Doesn't have these fields
- **Backend**: Doesn't support these fields
- **Impact**: Assignment and status tracking won't persist to database
- **Fix**: Either add to database or remove from frontend (depends on requirements)

### 12. **Brainstorm Ideas: Missing `title` Field**
- **Database**: Ideas table has `title` field
- **Frontend**: brainstormManager only stores `content`
- **Backend**: Expects `title` field
- **Impact**: Ideas won't have titles in database
- **Fix**: Add `title` field to frontend idea creation

---

## NAMING CONVENTION DECISION

**Recommendation**: Use **snake_case** in database and API, convert to **camelCase** in frontend for consistency with JavaScript conventions.

### Conversion Pattern:
```javascript
// API Response (snake_case)
{
  project_id: 1,
  chapter_number: 1,
  has_published_chapters: true,
  total_chapters: 5
}

// Frontend Internal (camelCase)
{
  projectId: 1,
  chapterNumber: 1,
  hasPublishedChapters: true,
  totalChapters: 5
}
```

---

## FILES TO UPDATE

### Frontend Data Managers (Convert to camelCase internally)
1. `src/utils/dataManager/sectionManager.js` - Fix `order` → `section_number`, add image fields
2. `src/utils/dataManager/brainstormManager.js` - Consolidate storage, add `title` to ideas
3. `src/utils/userManager/userStorage.js` - Change `avatar` → `profile_image`
4. `src/utils/dataManager/projectManager.js` - Handle snake_case from API
5. `src/utils/dataManager/chapterManager.js` - Handle snake_case from API

### Backend Routes (Verify snake_case usage)
1. `backend/routes/projects.js` - Verify all fields use snake_case
2. `backend/routes/chapters.js` - Verify all fields use snake_case
3. `backend/routes/sections.js` - Verify all fields use snake_case
4. `backend/routes/brainstorm.js` - Verify all fields use snake_case
5. `backend/routes/teams.js` - Verify all fields use snake_case

### Database Schema (Already correct)
- `INVERSA_DATABASE_SETUP.sql` - Already uses snake_case ✓

---

## IMPLEMENTATION STRATEGY

### Phase 1: Create API Response Transformer
Create a utility function to convert snake_case API responses to camelCase for frontend use:

```javascript
// src/utils/apiTransformer.js
export const toCamelCase = (obj) => {
  // Convert snake_case keys to camelCase
};

export const toSnakeCase = (obj) => {
  // Convert camelCase keys to snake_case
};
```

### Phase 2: Update Frontend Data Managers
- Add transformer functions to all data managers
- Update field names in localStorage structures
- Add missing fields (image_url, caption, type, title)

### Phase 3: Verify Backend Routes
- Ensure all routes use snake_case consistently
- Add missing endpoints for new fields
- Test API responses

### Phase 4: Update Database Schema (if needed)
- Add `assignedTo` and `status` fields to sections table (if required)
- Verify all soft delete fields are present

### Phase 5: Integration Testing
- Test full flow: Frontend → API → Database
- Verify data persistence
- Test data retrieval and display

---

## PRIORITY ORDER

1. **HIGH**: Fix section field names (order → section_number)
2. **HIGH**: Fix user profile image (avatar → profile_image)
3. **HIGH**: Consolidate brainstorm storage
4. **MEDIUM**: Standardize all camelCase/snake_case conversions
5. **MEDIUM**: Add missing fields to frontend managers
6. **LOW**: Add assignedTo/status to database (if needed)

---

**Last Updated**: May 14, 2026
**Status**: Ready for implementation
