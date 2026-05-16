# Cleanup src/utils/ - Windows PowerShell Commands

## ⚠️ PENTING: Gunakan Command PowerShell (Bukan Linux/Bash)

Kamu menggunakan Windows PowerShell, jadi syntax-nya berbeda dari Linux bash.

---

## ✅ Backup Sudah Berhasil

```powershell
# Backup sudah dibuat
Get-ChildItem -Path "src/utils.backup" -Recurse | Measure-Object
# Result: 26 files ✅
```

---

## Step 1: Verify Backup

```powershell
# Lihat struktur backup
Get-ChildItem -Path "src/utils.backup" -Recurse

# Atau lebih detail
Get-ChildItem -Path "src/utils.backup" -Recurse | Select-Object FullName
```

---

## Step 2: Verify Backend Services Ready

```powershell
# Check backend services exist
Get-ChildItem -Path "backend/services" -Filter "*.js"

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

```powershell
# Check API client exists
Get-ChildItem -Path "src/api" -Filter "*.js"

# Should show:
# - client.js ✅
```

---

## Step 4: Search for Old Imports (CRITICAL)

```powershell
# Search for imports dari src/utils/userManager
Select-String -Path "src/**/*.jsx", "src/**/*.js" -Pattern "from '@/utils/userManager'" -Recurse

# Search for imports dari src/utils/dataManager
Select-String -Path "src/**/*.jsx", "src/**/*.js" -Pattern "from '@/utils/dataManager'" -Recurse

# Search for imports dengan relative path
Select-String -Path "src/**/*.jsx", "src/**/*.js" -Pattern "from '\.\./utils/userManager'" -Recurse
Select-String -Path "src/**/*.jsx", "src/**/*.js" -Pattern "from '\.\./utils/dataManager'" -Recurse
Select-String -Path "src/**/*.jsx", "src/**/*.js" -Pattern "from '\.\./\.\./utils/userManager'" -Recurse
Select-String -Path "src/**/*.jsx", "src/**/*.js" -Pattern "from '\.\./\.\./utils/dataManager'" -Recurse

# JIKA ADA HASIL: STOP! Update components dulu sebelum delete
# JIKA TIDAK ADA HASIL: Lanjut ke Step 5
```

---

## Step 5: Search for localStorage Usage

```powershell
# Search for localStorage usage
Select-String -Path "src/**/*.jsx", "src/**/*.js" -Pattern "localStorage" -Recurse

# Expected results:
# - src/api/client.js (untuk token storage - OK)
# - Mungkin beberapa legitimate uses

# Jika ada di component lain: Update dulu
```

---

## Step 6: Delete Files (POINT OF NO RETURN)

### Option A: Manual Delete (Recommended)

```powershell
# Delete user manager folder
Remove-Item -Path "src/utils/userManager" -Recurse -Force

# Delete data manager folder
Remove-Item -Path "src/utils/dataManager" -Recurse -Force

# Delete root utils files
Remove-Item -Path "src/utils/userManager.js" -Force
Remove-Item -Path "src/utils/dataManager.js" -Force

# Verify only apiTransformer.js remains
Get-ChildItem -Path "src/utils"

# Should show:
# - apiTransformer.js ✅
# - (nothing else)
```

### Option B: Script Delete (Automated)

```powershell
# Save as: cleanup.ps1

Write-Host "🗑️  Deleting src/utils files..."

# Delete folders
Remove-Item -Path "src/utils/userManager" -Recurse -Force
Remove-Item -Path "src/utils/dataManager" -Recurse -Force

# Delete root files
Remove-Item -Path "src/utils/userManager.js" -Force
Remove-Item -Path "src/utils/dataManager.js" -Force

Write-Host "✅ Deleted successfully"

# Verify
Write-Host "📋 Remaining files in src/utils:"
Get-ChildItem -Path "src/utils"

# Run it
# .\cleanup.ps1
```

---

## Step 7: Verify Deletion

```powershell
# Check src/utils folder
Get-ChildItem -Path "src/utils"

# Should show ONLY:
# - apiTransformer.js ✅

# Verify no old files remain
Get-ChildItem -Path "src/utils" -Recurse -Filter "*.js"

# Should show ONLY:
# - src/utils/apiTransformer.js
```

---

## Step 8: Verify No Broken Imports

```powershell
# Check for any remaining old imports
Select-String -Path "src/**/*.jsx", "src/**/*.js" -Pattern "userManager" -Recurse | Where-Object { $_ -notmatch "apiTransformer" }
Select-String -Path "src/**/*.jsx", "src/**/*.js" -Pattern "dataManager" -Recurse | Where-Object { $_ -notmatch "apiTransformer" }

# Should return: No results (or only in comments)
```

---

## Step 9: Test Build

```powershell
# Try to build
npm run build

# If errors: Fix imports in components
# If success: Continue to Step 10
```

---

## Step 10: Test Dev Server

```powershell
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

```powershell
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

```powershell
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

```powershell
# If you need to rollback
git reset --hard HEAD~1

# Or restore from backup
Remove-Item -Path "src/utils" -Recurse -Force
Copy-Item -Path "src/utils.backup" -Destination "src/utils" -Recurse

# Then fix the issues and try again
```

---

## PowerShell vs Bash Comparison

| Task | Bash | PowerShell |
|------|------|-----------|
| List files | `ls -la` | `Get-ChildItem` |
| List recursively | `ls -la -R` | `Get-ChildItem -Recurse` |
| Search text | `grep -r "text"` | `Select-String -Pattern "text" -Recurse` |
| Delete folder | `rm -rf folder` | `Remove-Item -Path "folder" -Recurse -Force` |
| Delete file | `rm file.txt` | `Remove-Item -Path "file.txt" -Force` |
| Copy folder | `cp -r src dst` | `Copy-Item -Path "src" -Destination "dst" -Recurse` |
| Count files | `find . -type f \| wc -l` | `Get-ChildItem -Recurse \| Measure-Object` |

---

## Quick Reference - PowerShell Commands

### List Files
```powershell
# List current directory
Get-ChildItem

# List with details
Get-ChildItem -Force

# List recursively
Get-ChildItem -Recurse

# List specific file type
Get-ChildItem -Filter "*.js"
```

### Search Files
```powershell
# Search for text in files
Select-String -Path "src/**/*.js" -Pattern "searchText" -Recurse

# Search with line numbers
Select-String -Path "src/**/*.js" -Pattern "searchText" -Recurse | Select-Object Filename, LineNumber, Line
```

### Delete Files
```powershell
# Delete file
Remove-Item -Path "file.txt" -Force

# Delete folder
Remove-Item -Path "folder" -Recurse -Force

# Delete multiple files
Remove-Item -Path "file1.txt", "file2.txt" -Force
```

### Copy Files
```powershell
# Copy file
Copy-Item -Path "src.txt" -Destination "dst.txt"

# Copy folder
Copy-Item -Path "src" -Destination "dst" -Recurse
```

---

## Verification Checklist

### Before Delete
- [x] Backup created (src/utils.backup/) - 26 files ✅
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

## Timeline

| Step | Duration |
|------|----------|
| 1-3. Verify | 10 min |
| 4-5. Search | 10 min |
| 6. Delete | 1 min |
| 7-8. Verify | 5 min |
| 9-10. Test | 15 min |
| 11-12. Commit | 10 min |
| **Total** | **50 min** |

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

## Next Steps

1. **Verify Backend Services** (Step 2)
2. **Verify API Client** (Step 3)
3. **Search for Old Imports** (Step 4)
4. **Search for localStorage** (Step 5)
5. **Delete Files** (Step 6)
6. **Verify Deletion** (Step 7-8)
7. **Test** (Step 9-10)
8. **Commit** (Step 11-12)

---

**Ready to cleanup? Start with Step 2!** 🚀
