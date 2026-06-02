# Code Refactoring: Categories & Genres Data Consolidation

## 📝 Overview
Consolidated redundant categories and genres data from multiple sources (JSON files, database) into a single source of truth using the database with intelligent caching.

## 🔍 Problem Identified
- **Redundancy**: Data stored in 3 places:
  - Database tables (`categories`, `genres`)
  - JSON files (`badgeCategories.js`, `badgeGenre.js`)
  - Modal import files (`Datajson/categories.json`, `Datajson/genres.json`)
- **Maintenance burden**: Changes required updates in multiple locations
- **Unused database**: Database tables were created but not utilized by frontend

## ✅ Solution Implemented

### 1. New Hook: `useCategoriesAndGenres` 
**File**: `src/hooks/useCategoriesAndGenres.js`
- Fetches data from database via API
- Implements intelligent caching to prevent redundant API calls
- Provides helper methods: `getCategoryById()`, `getGenreById()`
- Used once on app startup, cached for entire session

### 2. Updated API Client
**File**: `src/api/client.js`
Added new endpoints:
```javascript
// ============ CATEGORIES ============
categories: {
  getAll: () => makeRequest('GET', '/categories'),
  getById: (id) => makeRequest('GET', `/categories/${id}`),
},

// ============ GENRES ============
genres: {
  getAll: () => makeRequest('GET', '/genres'),
  getById: (id) => makeRequest('GET', `/genres/${id}`),
},
```

### 3. Updated Components

#### BadgeCategories (`src/components/BadgeCategories.jsx`)
- Removed: Import from JSON file
- Added: `useCategoriesAndGenres` hook
- Changed: Access to `category.text_color` (database field) instead of `category.textColor`

#### BadgeGenre (`src/components/BadgeGenre.jsx`)
- Removed: Import from JSON file
- Added: `useCategoriesAndGenres` hook
- Changed: Access to `genre.text_color` (database field) instead of `genre.textColor`

#### CreateProjectModal (`src/InitiatorFolder/components/CreateProjectModal.jsx`)
- Removed: Imports from JSON files
- Added: `useCategoriesAndGenres` hook
- Updated: Select options to use hooked data
- Changed: Loop from `categories.categories` to `categories` (flat array)

## 🗑️ Files to Delete (After Backend API Ready)

Once backend endpoints are implemented:

1. **JSON Data Files** (can be deleted):
   - `src/data/badgeCategories.js`
   - `src/data/badgeGenre.js`
   - `src/Datajson/categories.json`
   - `src/Datajson/genres.json`

2. **Keep Database Tables** (do NOT delete):
   - `categories` table in PostgreSQL
   - `genres` table in PostgreSQL
   - These are the source of truth now

## 🚀 Benefits

✓ **Single Source of Truth**: Database is now the only source
✓ **Reduced Redundancy**: No more duplicate data maintenance
✓ **Better Performance**: Cached data prevents repeated API calls
✓ **Scalability**: Easy to add new categories/genres via database
✓ **Admin Control**: Admins can manage categories/genres without code changes
✓ **Maintainability**: Future changes only need database updates

## 📋 Database Field Mapping

When viewing database data in frontend, note the field name mapping:
- Database: `text_color` → Frontend: `text_color`
- Database: `bg_class` → Frontend: `bg_class`

The hook handles these automatically via database queries.

## 🔄 Cache Strategy

The hook implements a simple but effective caching mechanism:
```javascript
let categoriesCache = null;
let genresCache = null;

// If cache exists, return cached data
// Otherwise fetch from API and cache for subsequent uses
```

## ⚠️ Important Notes

1. **API Dependency**: This refactoring requires backend API endpoints:
   - `GET /categories`
   - `GET /genres`

2. **Fallback Behavior**: If API fails, badge components will show null (graceful degradation)

3. **No Breaking Changes**: All component interfaces remain the same

## 🧪 Testing Checklist

- [ ] Badge components display correctly with database data
- [ ] CreateProjectModal dropdown shows all categories/genres
- [ ] No console errors related to missing data
- [ ] Data loads on app startup
- [ ] Color/styling applies correctly from database

## 📚 Usage Example

```javascript
import { useCategoriesAndGenres } from './hooks/useCategoriesAndGenres';

function MyComponent() {
  const { categories, genres, getCategoryById, getGenreById } = useCategoriesAndGenres();
  
  const category = getCategoryById('novel');
  // Returns: { id: 'novel', name: 'Novel', color: '#020617', ... }
}
```

---
**Status**: ✅ Ready for API integration
**Last Updated**: June 2, 2026
