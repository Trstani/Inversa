// Data Manager - Hybrid approach (localStorage + API)
// Falls back to localStorage if API server is not available

const API_BASE_URL = 'http://localhost:3001/api';

// Fallback to localStorage
const saveToLocalStorage = (key, data) => {
    localStorage.setItem(`inversa_${key}`, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
    const data = localStorage.getItem(`inversa_${key}`);
    return data ? JSON.parse(data) : null;
};

// ============= PROJECTS =============

export const loadProjects = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`, { signal: AbortSignal.timeout(2000) });
        if (response.ok) {
            const data = await response.json();
            return data?.projects || [];
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const data = loadFromLocalStorage('projects');
    return data?.projects || [];
};

export const saveProject = async (project) => {
    try {
        const method = project.id ? 'PUT' : 'POST';
        const url = project.id ? `${API_BASE_URL}/projects/${project.id}` : `${API_BASE_URL}/projects`;
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
            signal: AbortSignal.timeout(2000),
        });
        
        if (response.ok) {
            return await loadProjects();
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const projects = await loadProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
        projects[existingIndex] = {
            ...projects[existingIndex],
            ...project,
            updatedAt: new Date().toISOString(),
        };
    } else {
        const newProject = {
            ...project,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 0,
            totalChapters: 0,
            collaborators: project.collaborators || [],
        };
        projects.push(newProject);
    }
    
    saveToLocalStorage('projects', { projects });
    return projects;
};

export const deleteProject = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, { 
            method: 'DELETE',
            signal: AbortSignal.timeout(2000),
        });
        if (response.ok) {
            return await loadProjects();
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const projects = await loadProjects();
    const filtered = projects.filter(p => p.id !== id);
    saveToLocalStorage('projects', { projects: filtered });
    return filtered;
};

export const getProjectById = async (id) => {
    const projects = await loadProjects();
    return projects.find(p => p.id === parseInt(id));
};

// ============= CHAPTERS =============

export const loadChapters = async (projectId = null) => {
    try {
        const url = projectId 
            ? `${API_BASE_URL}/chapters?projectId=${projectId}`
            : `${API_BASE_URL}/chapters`;
        
        const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
        if (response.ok) {
            const data = await response.json();
            return data?.chapters || [];
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const data = loadFromLocalStorage('chapters');
    const allChapters = data?.chapters || [];
    
    if (projectId) {
        return allChapters.filter(c => c.projectId === parseInt(projectId));
    }
    return allChapters;
};

export const saveChapter = async (chapter) => {
    try {
        const method = chapter.id ? 'PUT' : 'POST';
        const url = chapter.id ? `${API_BASE_URL}/chapters/${chapter.id}` : `${API_BASE_URL}/chapters`;
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chapter),
            signal: AbortSignal.timeout(2000),
        });
        
        if (response.ok) {
            return await loadChapters();
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const chapters = await loadChapters();
    const existingIndex = chapters.findIndex(c => c.id === chapter.id);
    
    if (existingIndex >= 0) {
        chapters[existingIndex] = {
            ...chapters[existingIndex],
            ...chapter,
            updatedAt: new Date().toISOString(),
        };
    } else {
        const projectChapters = await loadChapters(chapter.projectId);
        const newChapter = {
            ...chapter,
            id: Date.now(),
            chapterNumber: projectChapters.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: [],
        };
        chapters.push(newChapter);
        
        const projects = await loadProjects();
        const projectIndex = projects.findIndex(p => p.id === chapter.projectId);
        if (projectIndex >= 0) {
            projects[projectIndex].totalChapters = projectChapters.length + 1;
            projects[projectIndex].updatedAt = new Date().toISOString();
            saveToLocalStorage('projects', { projects });
        }
    }
    
    saveToLocalStorage('chapters', { chapters });
    return chapters;
};

export const deleteChapter = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chapters/${id}`, { 
            method: 'DELETE',
            signal: AbortSignal.timeout(2000),
        });
        if (response.ok) {
            return await loadChapters();
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const chapters = await loadChapters();
    const filtered = chapters.filter(c => c.id !== id);
    saveToLocalStorage('chapters', { chapters: filtered });
    return filtered;
};

export const getChapterById = async (projectId, chapterId) => {
    const chapters = await loadChapters(projectId);
    return chapters.find(c => c.id === parseInt(chapterId));
};

export const getChapterByNumber = async (projectId, chapterNumber) => {
    const chapters = await loadChapters(projectId);
    return chapters.find(c => c.chapterNumber === parseInt(chapterNumber));
};

// ============= COLLABORATION REQUESTS =============

export const loadCollaborationRequests = async (projectId = null) => {
    try {
        const url = projectId
            ? `${API_BASE_URL}/collaborations?projectId=${projectId}`
            : `${API_BASE_URL}/collaborations`;
        
        const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
        if (response.ok) {
            const data = await response.json();
            return data?.requests || [];
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const data = loadFromLocalStorage('collaborations');
    const allRequests = data?.requests || [];
    
    if (projectId) {
        return allRequests.filter(r => r.projectId === parseInt(projectId));
    }
    return allRequests;
};

export const saveCollaborationRequest = async (request) => {
    try {
        const response = await fetch(`${API_BASE_URL}/collaborations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(2000),
        });
        
        if (response.ok) {
            return await loadCollaborationRequests();
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const requests = await loadCollaborationRequests();
    const newRequest = {
        ...request,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString(),
    };
    requests.push(newRequest);
    saveToLocalStorage('collaborations', { requests });
    return requests;
};

export const updateCollaborationRequest = async (id, status, role = null) => {
    try {
        const requests = await loadCollaborationRequests();
        const request = requests.find(r => r.id === id);
        
        if (request) {
            const updateData = { ...request, status };
            if (role) updateData.requestedRole = role;
            
            const response = await fetch(`${API_BASE_URL}/collaborations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
                signal: AbortSignal.timeout(2000),
            });
            
            if (response.ok) {
                return await loadCollaborationRequests();
            }
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const requests = await loadCollaborationRequests();
    const requestIndex = requests.findIndex(r => r.id === id);
    
    if (requestIndex >= 0) {
        requests[requestIndex].status = status;
        
        if (status === 'approved') {
            const request = requests[requestIndex];
            const projects = await loadProjects();
            const projectIndex = projects.findIndex(p => p.id === request.projectId);
            
            if (projectIndex >= 0) {
                if (!projects[projectIndex].collaborators) {
                    projects[projectIndex].collaborators = [];
                }
                
                projects[projectIndex].collaborators.push({
                    userId: request.userId,
                    role: role || request.requestedRole,
                    status: 'approved',
                    assignedChapters: [],
                    joinedAt: new Date().toISOString(),
                });
                
                saveToLocalStorage('projects', { projects });
            }
        }
        
        saveToLocalStorage('collaborations', { requests });
    }
    
    return requests;
};

export const deleteCollaborationRequest = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/collaborations/${id}`, { 
            method: 'DELETE',
            signal: AbortSignal.timeout(2000),
        });
        if (response.ok) {
            return await loadCollaborationRequests();
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const requests = await loadCollaborationRequests();
    const filtered = requests.filter(r => r.id !== id);
    saveToLocalStorage('collaborations', { requests: filtered });
    return filtered;
};

// ============= UTILITY FUNCTIONS =============

export const incrementLikes = async (projectId) => {
    const projects = await loadProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
        project.likes = (project.likes || 0) + 1;
        await saveProject(project);
    }
    
    return projects;
};

export const decrementLikes = async (projectId) => {
    const projects = await loadProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
        project.likes = Math.max(0, (project.likes || 0) - 1);
        await saveProject(project);
    }
    
    return projects;
};

export const assignCollaboratorToChapter = async (projectId, userId, chapterId) => {
    const projects = await loadProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
        const collaborator = project.collaborators?.find(c => c.userId === userId);
        
        if (collaborator) {
            if (!collaborator.assignedChapters) {
                collaborator.assignedChapters = [];
            }
            
            if (!collaborator.assignedChapters.includes(chapterId)) {
                collaborator.assignedChapters.push(chapterId);
                await saveProject(project);
            }
        }
    }
    
    return projects;
};

// ============= COMMENTS =============

export const addComment = async (chapterId, comment) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment),
            signal: AbortSignal.timeout(2000),
        });
        
        if (response.ok) {
            return await loadChapters();
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const chapters = await loadChapters();
    const chapterIndex = chapters.findIndex(c => c.id === parseInt(chapterId));
    
    if (chapterIndex >= 0) {
        if (!chapters[chapterIndex].comments) {
            chapters[chapterIndex].comments = [];
        }
        
        const newComment = {
            id: Date.now(),
            userId: comment.userId,
            userName: comment.userName,
            content: comment.content,
            createdAt: new Date().toISOString(),
        };
        
        chapters[chapterIndex].comments.push(newComment);
        saveToLocalStorage('chapters', { chapters });
    }
    
    return chapters;
};

export const getComments = async (chapterId) => {
    const chapters = await loadChapters();
    const chapter = chapters.find(c => c.id === parseInt(chapterId));
    return chapter?.comments || [];
};

export const deleteComment = async (chapterId, commentId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}/comments/${commentId}`, {
            method: 'DELETE',
            signal: AbortSignal.timeout(2000),
        });
        
        if (response.ok) {
            return await loadChapters();
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }
    
    const chapters = await loadChapters();
    const chapterIndex = chapters.findIndex(c => c.id === parseInt(chapterId));
    
    if (chapterIndex >= 0) {
        chapters[chapterIndex].comments = chapters[chapterIndex].comments?.filter(
            c => c.id !== parseInt(commentId)
        ) || [];
        saveToLocalStorage('chapters', { chapters });
    }
    
    return chapters;
};


// ============= CREATE NEW CHAPTER =============

export const createNewChapter = async (projectId, chapterData) => {
    const chapters = await loadChapters();
    const projectChapters = chapters.filter(c => c.projectId === parseInt(projectId));
    
    const newChapter = {
        ...chapterData,
        id: Date.now(),
        projectId: parseInt(projectId),
        chapterNumber: projectChapters.length + 1,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
    };
    
    chapters.push(newChapter);
    saveToLocalStorage('chapters', { chapters });
    
    // Update project totalChapters
    const projects = await loadProjects();
    const projectIndex = projects.findIndex(p => p.id === parseInt(projectId));
    if (projectIndex >= 0) {
        projects[projectIndex].totalChapters = projectChapters.length + 1;
        projects[projectIndex].updatedAt = new Date().toISOString();
        saveToLocalStorage('projects', { projects });
    }
    
    return newChapter;
};
