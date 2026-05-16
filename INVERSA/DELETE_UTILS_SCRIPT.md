# Script untuk Delete src/utils/ Folder

## ⚠️ PENTING: Jalankan Langkah Demi Langkah

---

## Step 1: Backup (WAJIB DILAKUKAN)

```bash
# Backup src/utils folder
cp -r src/utils src/utils.backup

# Verify backup berhasil
ls -la src/utils.backup/
```

**Output yang diharapkan**:
```
src/utils.backup/
├── userManager/
├── dataManager/
├── userManager.js
├── dataManager.js
└── apiTransformer.js
```

---

## Step 2: Verify Backend Services Ready

```bash
# Check backend services exist
ls -la backend/services/

# Should show:
# - userService.js ✅
# - projectService.js ✅
# - chapterService.js ✅
# - teamService.js ✅
# - brainstormService.js ✅
# - sectionService.js ✅
# - collaborationService.js ✅
# - readingHistoryService.js ✅
# - reportService.js ✅
# - index.js ✅
```

---

## Step 3: Verify API Client Ready

```bash
# Check API client exists
ls -la src/api/

# Should show:
# - client.js ✅
```

---

## Step 4: Search for Old Imports (CRITICAL)

```bash
# Search for imports dari src/utils/userManager
grep -r "from '@/utils/userManager" src/ --include="*.jsx" --include="*.js"

# Search for imports dari src/utils/dataManager
grep -r "from '@/utils/dataManager" src/ --include="*.jsx" --include="*.js"

# Search for imports dengan relative path
grep -r "from '../utils/userManager" src/ --include="*.jsx" --include="*.js"
grep -r "from '../utils/dataManager" src/ --include="*.jsx" --include="*.js"
grep -r "from '../../utils/userManager" src/ --include="*.jsx" --include="*.js"
grep -r "from '../../utils/dataManager" src/ --include="*.jsx" --include="*.js"

# Search for imports dari utils root
grep -r "from '@/utils'" src/ --include="*.jsx" --include="*.js" | grep -v apiTransformer

# JIKA ADA HASIL: STOP! Update components dulu sebelum delete
# JIKA TIDAK ADA HASIL: Lanjut ke Step 5
```

---

## Step 5: Search for localStorage Usage

```bash
# Search for localStorage usage
grep -r "localStorage" src/ --include="*.jsx" --include="*.js"

# Expected results:
# - src/api/client.js (untuk token storage - OK)
# - Mungkin beberapa legitimate uses

# Jika ada di component lain: Update dulu
```

---

## Step 6: Delete Files (POINT OF NO RETURN)

### Option A: Manual Delete (Recommended)

```bash
# Delete user manager folder
rm -rf src/utils/userManager/

# Delete data manager folder
rm -rf src/utils/dataManager/

# Delete root utils files
rm src/utils/userManager.js
rm src/utils/dataManager.js

# Verify only apiTransformer.js remains
ls -la src/utils/

# Should show:
# - apiTransformer.js ✅
# - (nothing else)
```

### Option B: Script Delete (Automated)

```bash
#!/bin/bash
# save as: cleanup.sh

echo "🗑️  Deleting src/utils files..."

# Delete folders
rm -rf src/utils/userManager/
rm -rf src/utils/dataManager/

# Delete root files
rm src/utils/userManager.js
rm src/utils/dataManager.js

echo "✅ Deleted successfully"

# Verify
echo "📋 Remaining files in src/utils:"
ls -la src/utils/

# Run it
chmod +x cleanup.sh
./cleanup.sh
```

---

## Step 7: Verify Deletion

```bash
# Check src/utils folder
ls -la src/utils/

# Should show ONLY:
# - apiTransformer.js ✅

# Verify no old files remain
find src/utils -name "*.js" -type f

# Should show ONLY:
# src/utils/apiTransformer.js
```

---

## Step 8: Verify No Broken Imports

```bash
# Check for any remaining old imports
grep -r "userManager" src/ --include="*.jsx" --include="*.js" | grep -v "apiTransformer"
grep -r "dataManager" src/ --include="*.jsx" --include="*.js" | grep -v "apiTransformer"

# Should return: No results (or only in comments)
```

---

## Step 9: Test Build

```bash
# Try to build
npm run build

# If errors: Fix imports in components
# If success: Continue to Step 10
```

---

## Step 10: Test Dev Server

```bash
# Start dev server
npm run dev

# Test in browser:
# 1. Open http://localhost:5173
# 2. Check console for errors
# 3. Try login/register
# 4. Try create project
# 5. Try all features

# If no errors: Success! ✅
# If errors: Check console and fix
```

---

## Step 11: Commit Changes

```bash
# Create git branch
git checkout -b cleanup/remove-utils

# Add changes
git add -A

# Commit
git commit -m "cleanup: remove src/utils folder, use API client only

- Deleted src/utils/userManager/ (5 files)
- Deleted src/utils/dataManager/ (16 files)
- Kept src/utils/apiTransformer.js
- All components now use API client
- No more localStorage
- No more double files"

# Push
git push origin cleanup/remove-utils
```

---

## Step 12: Create Pull Request

```bash
# Create PR on GitHub/GitLab
# Title: "cleanup: remove src/utils folder"
# Description:
# - Removed 21 files from src/utils/
# - All logic now in backend services
# - All components use API client
# - No more localStorage
# - Cleaner architecture
```

---

## Rollback Plan (If Something Breaks)

```bash
# If you need to rollback
git reset --hard HEAD~1

# Or restore from backup
rm -rf src/utils
cp -r src/utils.backup src/utils

# Then fix the issues and try again
```

---

## Verification Checklist

### Before Delete
- [ ] Backup created (src/utils.backup/)
- [ ] Backend services verified
- [ ] API client verified
- [ ] No old imports found
- [ ] No localStorage usage (except token)

### After Delete
- [ ] src/utils/ has only apiTransformer.js
- [ ] No broken imports
- [ ] Build succeeds
- [ ] Dev server runs
- [ ] All features work
- [ ] No console errors

### Final
- [ ] Changes committed
- [ ] PR created
- [ ] Ready to merge

---

## Common Issues & Solutions

### Issue 1: "Cannot find module '@/utils/userManager'"
**Solution**: Update component imports to use API client

### Issue 2: "localStorage is not defined"
**Solution**: Remove localStorage usage, use API client instead

### Issue 3: "Build fails"
**Solution**: Check console for missing imports, fix them

### Issue 4: "Features not working"
**Solution**: Verify API client is being used correctly

---

## Quick Reference

### Files to Delete
```
src/utils/userManager/userAuth.js
src/utils/userManager/userProfile.js
src/utils/userManager/userSocial.js
src/utils/userManager/userStorage.js
src/utils/userManager/index.js
src/utils/dataManager/projectManager.js
src/utils/dataManager/chapterManager.js
src/utils/dataManager/sectionManager.js
src/utils/dataManager/teamManager.js
src/utils/dataManager/brainstormManager.js
src/utils/dataManager/collaborationManager.js
src/utils/dataManager/readingHistoryManager.js
src/utils/dataManager/reportManager.js
src/utils/dataManager/commentManager.js
src/utils/dataManager/discussionManager.js
src/utils/dataManager/contributionManager.js
src/utils/dataManager/projectFollowManager.js
src/utils/dataManager/teamProjectManager.js
src/utils/dataManager/teamRequestManager.js
src/utils/dataManager/storageUtils.js
src/utils/dataManager/index.js
src/utils/userManager.js
src/utils/dataManager.js
```

### Files to Keep
```
src/utils/apiTransformer.js
```

### Files to Use Instead
```
src/api/client.js (50+ methods)
backend/services/ (93 functions)
```

---

## Timeline

| Step | Duration |
|------|----------|
| 1. Backup | 5 min |
| 2-5. Verify | 10 min |
| 6. Delete | 1 min |
| 7-8. Verify | 5 min |
| 9-10. Test | 15 min |
| 11-12. Commit | 10 min |
| **Total** | **45 min** |

---

## Success Criteria

✅ All 21 files deleted (except apiTransformer.js)
✅ No broken imports
✅ Build succeeds
✅ Dev server runs
✅ All features work
✅ No console errors
✅ Changes committed

---

**Ready to cleanup? Start with Step 1!** 🚀
