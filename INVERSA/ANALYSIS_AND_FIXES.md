# INVERSA Platform - Analysis & Fixes

## 📋 Analisis Masalah yang Ditemukan

### Masalah 1: Initiator tidak bisa menambahkan chapter
**Root Cause:**
- EditorLayout memiliki `onCreateChapter` handler, tapi EditorPage tidak pass `onChaptersChange` callback
- EditorBody tidak menerima `chapters` prop untuk navigation
- ChapterSidebar tidak menerima `onDeleteChapter` handler

**Solusi:**
- Update EditorPage untuk pass callback yang tepat
- Update EditorBody untuk menerima chapters prop
- Update EditorLayout untuk handle chapter refresh

### Masalah 2: Tiptap editor tidak terhubung dengan save
**Root Cause:**
- EditorBody menggunakan Tiptap dengan benar
- Tapi `onSave` handler di EditorPage tidak di-trigger dengan benar
- EditorActions buttons tidak connected dengan handler

**Solusi:**
- Pastikan EditorBody pass chapters ke EditorNavigation
- Verify EditorActions buttons trigger handleSave dengan benar

### Masalah 3: Tidak bisa menambah chapter setelah chapter pertama
**Root Cause:**
- `createNewChapter` function di dataManager mungkin tidak update state dengan benar
- EditorLayout tidak refresh chapters list setelah create

**Solusi:**
- Update EditorPage untuk reload chapters setelah create
- Ensure chapter numbering auto-increment

### Masalah 4: Draft/Publish tidak tersimpan dengan benar
**Root Cause:**
- `saveChapter` function di dataManager perlu di-verify
- Status tidak di-set dengan benar

**Solusi:**
- Verify saveChapter function
- Ensure status (draft/published) di-save dengan benar

### Masalah 5: Collaborator tidak bisa edit draft chapter
**Root Cause:**
- Authorization check di EditorPage tidak ada
- Collaborator access control tidak di-implement

**Solusi:**
- Add authorization check di EditorPage
- Verify collaborator dapat access assigned chapters

---

## 🔧 Fixes yang Akan Dilakukan

### 1. Update EditorPage.jsx
- Add callback untuk refresh chapters
- Add authorization check
- Ensure chapter loading works correctly

### 2. Update EditorLayout.jsx
- Ensure chapters prop di-pass ke EditorBody
- Ensure onChaptersChange callback di-trigger

### 3. Update EditorBody.jsx
- Ensure chapters prop di-terima
- Pass chapters ke EditorNavigation

### 4. Verify dataManager.js
- Ensure createNewChapter works correctly
- Ensure saveChapter saves status correctly
- Ensure loadChapters filters by projectId correctly

### 5. Update ChapterSidebar.jsx
- Ensure onDeleteChapter handler di-implement
- Ensure chapter selection works correctly

### 6. Update ProjectDetail.jsx
- Add button untuk go to editor untuk initiator
- Ensure chapter list clickable untuk initiator

---

## 📊 Data Flow yang Benar

```
InitiatorDashboard
  ↓
ProjectList (click project)
  ↓
ProjectDetail (click "Edit Project" atau chapter)
  ↓
EditorPage (load project & chapters)
  ↓
EditorLayout (manage chapter creation & selection)
  ├─ ChapterSidebar (list chapters, create new, delete)
  └─ EditorBody (edit chapter content)
      ├─ EditorToolbar (formatting)
      ├─ EditorContent (Tiptap editor)
      └─ EditorActions (save draft, publish)
```

---

## 🎯 Implementation Plan

1. **Fix EditorPage** - Add proper callbacks dan authorization
2. **Fix EditorLayout** - Ensure chapters refresh after create
3. **Fix EditorBody** - Ensure chapters prop passed correctly
4. **Verify dataManager** - Ensure all functions work correctly
5. **Test Flow** - Test complete flow dari create project → add chapter → save

---

## ✅ Checklist

- [ ] EditorPage properly loads chapters
- [ ] EditorPage properly handles chapter creation
- [ ] EditorPage properly handles chapter save (draft/publish)
- [ ] EditorLayout properly refreshes chapters
- [ ] EditorBody properly receives chapters
- [ ] ChapterSidebar properly displays chapters
- [ ] ChapterSidebar properly handles create chapter
- [ ] ChapterSidebar properly handles delete chapter
- [ ] Tiptap editor properly saves content
- [ ] Authorization check for collaborators
- [ ] Draft chapters accessible to collaborators
- [ ] Published chapters visible to all
