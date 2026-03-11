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

            const projects = data?.projects || [];

            return projects.filter(p => !p.hidden);
        }
    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }

    const data = loadFromLocalStorage('projects');
    const projects = data?.projects || [];

    return projects.filter(p => !p.hidden);
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
            views: 0,
            totalChapters: 0,
            collaborators: project.collaborators || [],
            hidden: false
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

export const lockChapter = (chapterId, userId) => {

    const data = loadFromLocalStorage('chapters')
    if (!data?.chapters) return
    const chapters = data?.chapters || []

    const LOCK_TIMEOUT = 1000 * 60 * 10 // 10 menit

    const updated = chapters.map((chapter) => {

        if (chapter.id === chapterId) {

            if (chapter.lockedBy && chapter.lockedBy !== userId) {

                const expired = Date.now() - chapter.lockedAt > LOCK_TIMEOUT

                if (!expired) {
                    throw new Error("Chapter sedang diedit user lain")
                }

            }

            return {
                ...chapter,
                lockedBy: userId,
                lockedAt: Date.now(),
            }
        }

        return chapter
    })

    saveToLocalStorage('chapters', { chapters: updated })
}

export const unlockChapter = (chapterId, userId) => {

    const data = loadFromLocalStorage('chapters')
    if (!data?.chapters) return

    const chapters = data.chapters

    const updated = chapters.map((chapter) => {

        if (chapter.id === chapterId && chapter.lockedBy === userId) {
            return {
                ...chapter,
                lockedBy: null,
                lockedAt: null,
            }
        }

        return chapter
    })

    saveToLocalStorage('chapters', { chapters: updated })
}

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
            lockedBy: chapters[existingIndex].lockedBy || null,
            lockedAt: chapters[existingIndex].lockedAt || null,
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

// ============= REPORTS =============

export const loadReports = async (projectId = null) => {

    try {

        const url = projectId
            ? `${API_BASE_URL}/reports?projectId=${projectId}`
            : `${API_BASE_URL}/reports`;

        const response = await fetch(url, {
            signal: AbortSignal.timeout(2000)
        });

        if (response.ok) {
            const data = await response.json();
            return data?.reports || [];
        }

    } catch (error) {
        console.warn('API unavailable, using localStorage');
    }

    const data = loadFromLocalStorage('reports');
    const allReports = data?.reports || [];

    if (projectId) {
        return allReports.filter(r => r.projectId === parseInt(projectId));
    }

    return allReports;
};



export const reportProject = async (reportData) => {

    try {

        const response = await fetch(`${API_BASE_URL}/reports`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(reportData),

            signal: AbortSignal.timeout(2000)

        });

        if (response.ok) {
            return await loadReports();
        }

    } catch (error) {

        console.warn('API unavailable, using localStorage');

    }

    const data = loadFromLocalStorage('reports');
    const reports = data?.reports || [];

    const alreadyReported = reports.find(r =>
        r.projectId === parseInt(reportData.projectId) &&
        r.reportedBy === reportData.reportedBy
    );

    if (alreadyReported) {

        throw new Error("You already reported this project");

    }

    const newReport = {

        id: Date.now(),

        projectId: parseInt(reportData.projectId),

        reportedBy: reportData.reportedBy,

        reason: reportData.reason,

        note: reportData.note || "",

        status: "pending",

        createdAt: new Date().toISOString()

    };

    reports.push(newReport);

    saveToLocalStorage('reports', { reports });

    /*
    =========================
    AUTO HIDE PROJECT
    =========================
    */

    const projectReports = reports.filter(
        r => r.projectId === parseInt(reportData.projectId)
    );

    if (projectReports.length >= 12) {

        await hideProject(reportData.projectId);

    }

    return reports;
};



export const deleteReport = async (reportId) => {

    try {

        const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {

            method: 'DELETE',

            signal: AbortSignal.timeout(2000)

        });

        if (response.ok) {
            return await loadReports();
        }

    } catch (error) {

        console.warn('API unavailable, using localStorage');

    }

    const data = loadFromLocalStorage('reports');
    const reports = data?.reports || [];

    const filtered = reports.filter(r => r.id !== reportId);

    saveToLocalStorage('reports', { reports: filtered });

    return filtered;
};



export const getReportsByProject = async (projectId) => {

    const reports = await loadReports();

    return reports.filter(r => r.projectId === parseInt(projectId));

};

// ============= PROJECT MODERATION =============

export const hideProject = async (projectId) => {

    const projects = await loadProjects();

    const projectIndex = projects.findIndex(
        p => p.id === parseInt(projectId)
    );

    if (projectIndex >= 0) {

        projects[projectIndex].hidden = true;
        projects[projectIndex].hiddenAt = new Date().toISOString();

        saveToLocalStorage('projects', { projects });

    }

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

export const incrementViews = async (projectId) => {
    const projects = await loadProjects();
    const project = projects.find(p => p.id === projectId);

    if (project) {
        project.views = (project.views || 0) + 1;
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

// ============= FOLLOW PROJECTS =============

export const loadFollowedProjects = async (userId) => {

    const data = loadFromLocalStorage('follows');
    const follows = data?.follows || [];

    const userFollows = follows.filter(
        f => f.userId === userId
    );

    const projects = await loadProjects();

    return projects.filter(project =>
        userFollows.some(f => f.projectId === project.id)
    );

};

export const followProject = (userId, projectId) => {

    const data = loadFromLocalStorage('follows');
    const follows = data?.follows || [];

    const alreadyFollowed = follows.find(
        f => f.userId === userId && f.projectId === projectId
    );

    if (alreadyFollowed) return follows;

    follows.push({
        id: Date.now(),
        userId,
        projectId,
        followedAt: new Date().toISOString()
    });

    saveToLocalStorage('follows', { follows });

    return follows;
};

export const unfollowProject = (userId, projectId) => {

    const data = loadFromLocalStorage('follows');
    const follows = data?.follows || [];

    const filtered = follows.filter(
        f => !(f.userId === userId && f.projectId === projectId)
    );

    saveToLocalStorage('follows', { follows: filtered });

    return filtered;
};

// ============= READING HISTORY =============

export const loadReadingHistory = async (userId) => {

  const data = loadFromLocalStorage('readingHistory');
  const history = data?.history || [];

  const projects = await loadProjects();

  const userHistory = history
    .filter(h => String(h.userId) === String(userId))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const result = userHistory
    .map(h => {

      const project = projects.find(
        p => String(p.id) === String(h.projectId)
      );

      if (!project) return null;

      return {
        ...project,
        chapterId: h.chapterId,
        updatedAt: h.updatedAt
      };

    })
    .filter(Boolean);

  return result;
};

export const saveReadingHistory = (entry) => {

    const data = loadFromLocalStorage('readingHistory');
    const history = data?.history || [];

    const existingIndex = history.findIndex(
        h => h.userId === entry.userId && h.projectId === entry.projectId
    );

    if (existingIndex >= 0) {

        history[existingIndex] = {
            ...history[existingIndex],
            chapterId: entry.chapterId,
            updatedAt: new Date().toISOString()
        };

    } else {

        history.push({
            id: Date.now(),
            userId: entry.userId,
            projectId: entry.projectId,
            chapterId: entry.chapterId,
            updatedAt: new Date().toISOString()
        });

    }

    saveToLocalStorage('readingHistory', { history });

    return history;
};

export const getContinueReading = async (userId) => {

    const history = loadReadingHistory(userId);

    if (!history.length) return null;

    const latest = history[0];

    const project = await getProjectById(latest.projectId);

    return {
        project,
        chapterId: latest.chapterId
    };
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

        lockedBy: null,
        lockedAt: null,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
    }

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
