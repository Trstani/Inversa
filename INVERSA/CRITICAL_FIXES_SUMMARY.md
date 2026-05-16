# CRITICAL FIXES REQUIRED - Summary

## Status: PHASE 1 COMPLETE, PHASE 2 IN PROGRESS

---

## COMPLETED WORK ✅

### 1. Frontend Data Managers Updated
- ✅ Created `src/utils/apiTransformer.js` - Converts between snake_case and camelCase
- ✅ Updated `src/utils/dataManager/sectionManager.js` - Fixed field names, added API integration
- ✅ Updated `src/utils/dataManager/brainstormManager.js` - Consolidated storage, added missing functions
- ✅ Updated `src/utils/dataManager/projectManager.js` - Added API transformer
- ✅ Updated `src/utils/dataManager/chapterManager.js` - Added API transformer
- ✅ Updated `src/utils/userManager/userStorage.js` - Changed avatar → profileImage

### 2. Documentation Created
- ✅ `ALIGNMENT_FIXES_REQUIRED.md` - Detailed mismatch analysis
- ✅ `IMPLEMENTATION_GUIDE.md` - Step-by-step implementation guide

---

## REMAINING CRITICAL ISSUES

### Issue 1: Backend Brainstorm Route Uses Wrong Field Names
**Location**: `backend/routes/brainstorm.js`

**Problem**:
- Route uses `content` field but database has `title` and `description`
- Route uses `chapter_reference` but database has `chapter_id`
- Route uses `user_name` but database doesn't have this field

**Current Code**:
```javascript
// WRONG - doesn't match database schema
INSERT INTO ideas (brainstorm_id, user_id, user_name, content, chapter_reference, votes, ...)
```

**Correct Code**:
```javascript
// CORRECT - matches database schema
INSERT INTO ideas (brainstorm_id, chapter_id, title, description, votes, ...)
```

**Fix Required**:
- Update all brainstorm route endpoints to use correct field names
- Remove `user_id` and `user_name` fields (not in database)
- Use `title` and `description` instead of `content`
- Use `chapter_id` instead of `chapter_reference`

---

### Issue 2: Database Schema Has `section_order` but API Uses `section_number`
**Location**: `INVERSA_DATABASE_SETUP.sql` line 195

**Problem**:
- Database column is named `section_order`
- Frontend and backend API use `section_number`
- This causes field name mismatch

**Current Schema**:
```sql
CREATE TABLE sections (
  ...
  section_order INTEGER NOT NULL,
  ...
);
```

**Fix Required**:
```sql
ALTER TABLE sections RENAME COLUMN section_order TO section_number;
```

---

### Issue 3: Backend Routes Need Verification
**Files to Check**:
- `backend/routes/projects.js` - ✅ Looks correct
- `backend/routes/chapters.js` - ✅ Looks correct
- `backend/routes/sections.js` - ✅ Looks correct
- `backend/routes/brainstorm.js` - ❌ NEEDS FIXES
- `backend/routes/teams.js` - ⚠️ Needs verification
- `backend/routes/users.js` - ⚠️ Needs verification
- `backend/routes/collaboration.js` - ⚠️ Needs verification

---

## IMMEDIATE ACTION ITEMS

### Priority 1: Fix Brainstorm Route (CRITICAL)
1. Update all brainstorm endpoints to use correct field names
2. Remove `user_id` and `user_name` from INSERT statements
3. Use `title` and `description` instead of `content`
4. Use `chapter_id` instead of `chapter_reference`

### Priority 2: Update Database Schema (CRITICAL)
1. Rename `section_order` to `section_number` in sections table
2. Verify all other field names match API expectations

### Priority 3: Verify All Backend Routes (HIGH)
1. Check teams route for field name consistency
2. Check users route for `profile_image` field
3. Check collaboration route for field name consistency

### Priority 4: Integration Testing (HIGH)
1. Test project creation flow
2. Test chapter creation flow
3. Test section creation flow
4. Test brainstorm features
5. Verify data persists in database

---

## FIELD NAME CORRECTIONS NEEDED

### Brainstorm Ideas
| Current (WRONG) | Correct (Database) |
|---|---|
| content | title + description |
| chapter_reference | chapter_id |
| user_id | (remove - not in database) |
| user_name | (remove - not in database) |

### Sections
| Current (WRONG) | Correct (Database) |
|---|---|
| section_order | section_number |

---

## DEPLOYMENT READINESS

**Current Status**: 60% Ready
- ✅ Frontend data managers aligned
- ✅ API transformer created
- ❌ Backend routes need fixes
- ❌ Database schema needs update
- ⚠️ Integration testing pending

**Blockers**:
1. Brainstorm route field name mismatch
2. Database schema field name mismatch
3. Missing backend route verification

**Timeline**:
- Fix brainstorm route: 30 minutes
- Update database schema: 15 minutes
- Verify other routes: 45 minutes
- Integration testing: 1-2 hours
- **Total**: ~3 hours to full readiness

---

## NEXT STEPS

1. **Fix Brainstorm Route** - Update field names to match database
2. **Update Database Schema** - Rename section_order to section_number
3. **Verify All Routes** - Check teams, users, collaboration routes
4. **Run Integration Tests** - Test full flow from frontend to database
5. **Deploy to Staging** - Test on staging environment
6. **Deploy to Production** - Deploy to Vercel, Render, Supabase

---

**Last Updated**: May 14, 2026
**Status**: Phase 1 Complete, Phase 2 In Progress
