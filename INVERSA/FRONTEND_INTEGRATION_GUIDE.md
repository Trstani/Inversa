# INVERSA Frontend Integration Guide

## Overview

This guide explains how to integrate the new backend API client with frontend components, replacing localStorage-based utilities.

**Status**: API Client created (`src/api/client.js`)
**Next**: Update components to use API client

---

## Quick Start

### 1. Import API Client
```javascript
import { apiClient, setAuthToken, isAuthenticated } from '@/api/client';
```

### 2. Use API Methods
```javascript
// Get all projects
const response = await apiClient.projects.getAll();
const projects = response.projects;

// Create project
const newProject = await apiClient.projects.create({
  title: 'My Project',
  description: 'Project description',
  category_id: 'novel',
  genre_id: 'adventure'
});
```

### 3. Handle Authentication
```javascript
// After login
const response = await apiClient.auth.login({
  email: 'user@example.com',
  password: 'password'
});

if (response.success) {
  setAuthToken(response.token);
  // Redirect to dashboard
}
```

---

## Component Migration Examples

### Example 1: Project List Component

**Before (localStorage)**:
```javascript
import { loadProjects } from '@/utils/dataManager/projectManager';

export function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await loadProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

**After (API Client)**:
```javascript
import { apiClient } from '@/api/client';

export function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiClient.projects.getAll();
        setProjects(response.projects || []);
      } catch (error) {
        setError(error.message);
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

---

### Example 2: Create Project Component

**Before (localStorage)**:
```javascript
import { saveProject } from '@/utils/dataManager/projectManager';

export function CreateProject() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    genre_id: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const project = await saveProject(formData);
      console.log('Project created:', project);
      // Redirect or update list
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Project title"
      />
      {/* More fields */}
      <button type="submit">Create</button>
    </form>
  );
}
```

**After (API Client)**:
```javascript
import { apiClient } from '@/api/client';

export function CreateProject() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    genre_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.projects.create(formData);
      console.log('Project created:', response.project);
      // Redirect or update list
    } catch (error) {
      setError(error.message);
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Project title"
        disabled={loading}
      />
      {/* More fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

---

### Example 3: Authentication

**Before (localStorage)**:
```javascript
import { loginUser } from '@/utils/userManager/userAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

**After (API Client)**:
```javascript
import { apiClient, setAuthToken } from '@/api/client';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.auth.login({ email, password });
      
      if (response.success) {
        setAuthToken(response.token);
        // Store user info if needed
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (error) {
      setError(error.message);
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={loading}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## Common Patterns

### Pattern 1: Fetch Data on Mount
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await apiClient.projects.getAll();
      setData(response.projects);
    } catch (error) {
      setError(error.message);
    }
  };

  fetchData();
}, []);
```

### Pattern 2: Refetch on Dependency Change
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await apiClient.projects.getById(projectId);
      setProject(response.project);
    } catch (error) {
      setError(error.message);
    }
  };

  if (projectId) {
    fetchData();
  }
}, [projectId]);
```

### Pattern 3: Handle Form Submission
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const response = await apiClient.projects.create(formData);
    // Success handling
    onSuccess?.(response.project);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Pattern 4: Optimistic Updates
```javascript
const handleLike = async (projectId) => {
  // Optimistic update
  setProjects(projects.map(p => 
    p.id === projectId ? { ...p, likes: p.likes + 1 } : p
  ));

  try {
    await apiClient.projects.incrementLikes(projectId);
  } catch (error) {
    // Rollback on error
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, likes: p.likes - 1 } : p
    ));
    setError(error.message);
  }
};
```

---

## Error Handling

### Global Error Handler
```javascript
// Create error boundary
export function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return <div className="error">Something went wrong: {error.message}</div>;
  }

  return children;
}
```

### API Error Handling
```javascript
try {
  const response = await apiClient.projects.create(data);
} catch (error) {
  if (error.message.includes('Unauthorized')) {
    // Handle auth error
    navigate('/login');
  } else if (error.message.includes('not found')) {
    // Handle not found
    setError('Project not found');
  } else {
    // Handle generic error
    setError(error.message);
  }
}
```

---

## Loading States

### Loading Skeleton
```javascript
export function ProjectListSkeleton() {
  return (
    <div>
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
        </div>
      ))}
    </div>
  );
}

// Usage
{loading ? <ProjectListSkeleton /> : <ProjectList />}
```

### Loading Spinner
```javascript
export function LoadingSpinner() {
  return <div className="spinner">Loading...</div>;
}

// Usage
{loading && <LoadingSpinner />}
```

---

## Environment Configuration

### Development
Create `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Production
Create `.env.production`:
```env
VITE_API_URL=https://api.inversa.com/api
```

### Usage in Code
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Testing

### Mock API Client
```javascript
// __mocks__/api/client.js
export const apiClient = {
  projects: {
    getAll: jest.fn().mockResolvedValue({
      success: true,
      projects: [
        { id: 1, title: 'Test Project' }
      ]
    }),
    create: jest.fn().mockResolvedValue({
      success: true,
      project: { id: 1, title: 'New Project' }
    })
  }
};
```

### Test Component
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { apiClient } from '@/__mocks__/api/client';
import { ProjectList } from '@/components/ProjectList';

describe('ProjectList', () => {
  it('displays projects', async () => {
    render(<ProjectList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
  });
});
```

---

## Migration Checklist

- [ ] Create `src/api/client.js` ✅
- [ ] Update authentication components
- [ ] Update project components
- [ ] Update chapter components
- [ ] Update team components
- [ ] Update brainstorm components
- [ ] Update reading history components
- [ ] Remove localStorage fallback
- [ ] Test all components
- [ ] Deploy to production

---

## Component Update Priority

### Priority 1 (Core)
- [ ] AuthContext.jsx - Login/Register
- [ ] UserDashboard.jsx - User profile
- [ ] ProjectList.jsx - List projects
- [ ] ProjectDetail.jsx - View project

### Priority 2 (Editing)
- [ ] EditorLayout.jsx - Edit chapters
- [ ] ChapterReader.jsx - Read chapters
- [ ] CreateProjectModal.jsx - Create project

### Priority 3 (Collaboration)
- [ ] TeamDetailPage.jsx - Team management
- [ ] BrainstormGridLayout.jsx - Brainstorming
- [ ] CollaborationRequestModal.jsx - Collaboration

### Priority 4 (Features)
- [ ] ProjectsExplorer.jsx - Browse projects
- [ ] HistoryProjectItem.jsx - Reading history
- [ ] ReportsModal.jsx - Report project

---

## Troubleshooting

### API Not Responding
```javascript
// Check if backend is running
const checkBackend = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    console.log('Backend status:', response.ok);
  } catch (error) {
    console.error('Backend not responding:', error);
  }
};
```

### Authentication Issues
```javascript
// Check token
const token = localStorage.getItem('authToken');
console.log('Token:', token ? 'Present' : 'Missing');

// Check if authenticated
import { isAuthenticated } from '@/api/client';
console.log('Authenticated:', isAuthenticated());
```

### CORS Errors
- Verify backend CORS configuration
- Check frontend URL in backend `.env`
- Check browser console for specific error

---

## Performance Tips

1. **Debounce Search**: Debounce API calls for search inputs
2. **Pagination**: Implement pagination for large lists
3. **Caching**: Cache frequently accessed data
4. **Lazy Loading**: Load data on demand
5. **Request Deduplication**: Prevent duplicate API calls

---

## References

- API Client: `src/api/client.js`
- Backend Services: `backend/services/`
- Migration Guide: `MIGRATION_GUIDE.md`
- Backend Structure: `BACKEND_STRUCTURE.md`

---

**Last Updated**: May 15, 2026
**Status**: Ready for Implementation
