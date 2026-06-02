/**
 * API Client
 * Centralized API communication layer for frontend
 * Replaces: src/utils/dataManager/ utilities
 * 
 * Usage:
 * import { apiClient } from '@/api/client';
 * const projects = await apiClient.projects.getAll();
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============ HELPER FUNCTIONS ============

const getAuthToken = () => {
  // Get token from localStorage or sessionStorage
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API Error');
  }

  return data;
};

const makeRequest = async (method, endpoint, body = null, includeAuth = true) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: getHeaders(includeAuth),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

// ============ API CLIENT ============

export const apiClient = {
  // ============ GENERIC METHODS ============
  get: (endpoint) => makeRequest('GET', endpoint),
  post: (endpoint, data) => makeRequest('POST', endpoint, data),
  put: (endpoint, data) => makeRequest('PUT', endpoint, data),
  delete: (endpoint) => makeRequest('DELETE', endpoint),

  // ============ AUTH ============
  auth: {
    register: (data) => makeRequest('POST', '/auth/register', data, false),
    login: (data) => makeRequest('POST', '/auth/login', data, false),
  },

  // ============ USERS ============
  users: {
    getAll: () => makeRequest('GET', '/users'),
    getById: (id) => makeRequest('GET', `/users/${id}`),
    getByEmail: (email) => makeRequest('GET', `/users?email=${email}`),
    update: (id, data) => makeRequest('PUT', `/users/${id}`, data),
    delete: (id) => makeRequest('DELETE', `/users/${id}`),
    follow: (followingId) => makeRequest('POST', `/users/follow/${followingId}`, {}),
    unfollow: (followingId) => makeRequest('DELETE', `/users/follow/${followingId}`),
    getFollowers: (id) => makeRequest('GET', `/users/${id}/followers`),
    getFollowing: (id) => makeRequest('GET', `/users/${id}/following`),
  },

  admin: {

  getDashboard: () => makeRequest('GET', '/admin/dashboard'),
  },

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

  // ============ PROJECTS ============
  projects: {
    getAll: (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return makeRequest('GET', `/projects${params ? '?' + params : ''}`);
    },
    getById: (id) => makeRequest('GET', `/projects/${id}`),
    getPublished: () => makeRequest('GET', '/projects/published'),
    create: (data) => makeRequest('POST', '/projects', data),
    update: (id, data) => makeRequest('PUT', `/projects/${id}`, data),
    delete: (id) => makeRequest('DELETE', `/projects/${id}`),
    incrementViews: (id) => makeRequest('POST', `/projects/${id}/views`, {}),
    like: (id) => makeRequest('POST', `/projects/${id}/like`,{} ),
    hide: (id) => makeRequest('POST', `/projects/${id}/hide`, {}),
    unhide: (id) => makeRequest('POST', `/projects/${id}/unhide`, {}),
    getCollaborators: (id) => makeRequest('GET', `/projects/${id}/collaborators`),
    follow: (id) => makeRequest('POST', `/projects/${id}/follow`, {}),
    getMyFollows: () => makeRequest('GET', '/projects/follows/me'),
    getUserFollows: (userId) => makeRequest('GET', `/projects/follows/user/${userId}`),
    getUserHistory: (userId) => makeRequest('GET', `/reading-history/user/${userId}`),
    getInteractions: (id) => makeRequest('GET',`/projects/${id}/interactions`),
  },

  // ============ CHAPTERS ============
  chapters: {
    getAll: (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return makeRequest('GET', `/chapters${params ? '?' + params : ''}`);
    },
    getById: (id) => makeRequest('GET', `/chapters/${id}`),
    getByProject: (projectId) => makeRequest('GET', `/chapters/project/${projectId}`),
    create: (data) => makeRequest('POST', '/chapters', data),
    update: (id, data) => makeRequest('PUT', `/chapters/${id}`, data),
    delete: (id) => makeRequest('DELETE', `/chapters/${id}`),
    publish: (id) => makeRequest('POST', `/chapters/${id}/publish`, {}),
    unpublish: (id) => makeRequest('POST', `/chapters/${id}/unpublish`, {}),
    lock: (id) => makeRequest('POST', `/chapters/${id}/lock`, {}),
    unlock: (id) => makeRequest('POST', `/chapters/${id}/unlock`, {}),
  },

  // ============ SECTIONS ============
  sections: {
    getAll: (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return makeRequest('GET', `/sections${params ? '?' + params : ''}`);
    },
    getById: (id) => makeRequest('GET', `/sections/${id}`),
    getByChapter: (chapterId) => makeRequest('GET', `/sections/chapter/${chapterId}`),
    create: (data) => makeRequest('POST', '/sections', data),
    update: (id, data) => makeRequest('PUT', `/sections/${id}`, data),
    delete: (id) => makeRequest('DELETE', `/sections/${id}`),
    reorder: (id, data) => makeRequest('PATCH', `/sections/${id}/reorder`, data),
    lock: (id) => makeRequest( 'POST', `/sections/${id}/lock`, {} ),
    unlock: (id) => makeRequest('POST',`/sections/${id}/unlock`, {} ),
  },

 // ============ TEAMS ============
teams: {
  getAll: () => makeRequest('GET', '/teams'),
  getById: (id) => makeRequest('GET', `/teams/${id}`),
  getUserTeams: (userId) => makeRequest('GET', `/teams/user/${userId}`),
  create: (data) => makeRequest('POST', '/teams', data),
  update: (id, data) => makeRequest('PUT', `/teams/${id}`, data),
  delete: (id) => makeRequest('DELETE', `/teams/${id}`),
  getMembers: (id) => makeRequest('GET', `/teams/${id}/members`),
  removeMember: (id, userId) => makeRequest('DELETE', `/teams/${id}/members/${userId}`),
  getProjects: (id) => makeRequest('GET', `/teams/${id}/projects`),
  getRequests: (teamId) => makeRequest('GET', `/team-requests/team/${teamId}`),
  createRequest: (data) => makeRequest('POST', '/team-requests', data),
  approveRequest: (requestId) => makeRequest('PATCH',`/team-requests/${requestId}/approve`,{}),
  rejectRequest: (requestId) => makeRequest('PATCH',`/team-requests/${requestId}/reject`, {}),
  deleteRequest: (requestId) => makeRequest('DELETE', `/team-requests/${requestId}`),
},

  // ============ COMMENTS ============

  comments: {
    getByChapter: (chapterId) =>makeRequest('GET',`/comments/chapter/${chapterId}`),
    create: (chapterId, data) => makeRequest('POST', `/comments/chapter/${chapterId}`, data),
    delete: (commentId) => makeRequest('DELETE', `/comments/${commentId}`),
  },

  // ============ BRAINSTORM ============
  brainstorm: {
    getSession: (projectId) => makeRequest('GET', `/brainstorm/${projectId}`),
    getIdeas: (projectId) => makeRequest('GET', `/brainstorm/${projectId}/ideas`),
    addIdea: (projectId, data) => makeRequest('POST', `/brainstorm/${projectId}/ideas`, data),
    deleteIdea: (projectId, ideaId) => makeRequest('DELETE', `/brainstorm/ideas/${ideaId}`),
    voteIdea: (projectId, ideaId ) => makeRequest('POST', `/brainstorm/ideas/${ideaId}/vote`,{}),
    unvoteIdea: (projectId, ideaId) => makeRequest('DELETE', `/brainstorm/${projectId}/ideas/${ideaId}/vote`),
    getTasks: (projectId) => makeRequest('GET', `/brainstorm/${projectId}/tasks`),
    addTask: (projectId, data) => makeRequest('POST', `/brainstorm/${projectId}/tasks`, data),
    updateTask: (projectId, taskId, data) => makeRequest('PUT',`/brainstorm/tasks/${taskId}`,data),
    deleteTask: (projectId, taskId) =>makeRequest('DELETE',`/brainstorm/tasks/${taskId}`),
    getComments: (ideaId) => makeRequest('GET', `/brainstorm/ideas/${ideaId}/comments`),
    addComment: (ideaId, data) => makeRequest('POST', `/brainstorm/ideas/${ideaId}/comments`, data),
    deleteComment: (ideaId, commentId) => makeRequest('DELETE', `/brainstorm/ideas/${ideaId}/comments/${commentId}`),
    getDiscussions: (projectId) =>makeRequest('GET', `/brainstorm/${projectId}/discussions`),
    addDiscussion: (projectId, data) => makeRequest('POST', `/brainstorm/${projectId}/discussions`, data),
    deleteDiscussion: (id) => makeRequest('DELETE',`/brainstorm/discussions/${id}`),
    getNotes: (projectId) => makeRequest('GET', `/brainstorm/${projectId}/notes`),
    addNote: (projectId, data) => makeRequest('POST', `/brainstorm/${projectId}/notes`, data),
    deleteNote: (id) => makeRequest('DELETE', `/brainstorm/notes/${id}`),
  },

  // ============ COLLABORATION ============
  collaboration: {
    getRequests: (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return makeRequest('GET', `/collaboration/requests${params ? '?' + params : ''}`);
    },
    getProjectRequests: (projectId) => makeRequest('GET', `/collaboration/project/${projectId}`),
    getUserRequests: (userId) => makeRequest('GET', `/collaboration/user/${userId}`),
    createRequest: (data) => makeRequest('POST', '/collaboration/requests', data),
    updateRequest: (id, data) => makeRequest('PUT', `/collaboration/requests/${id}`, data),
    deleteRequest: (id) => makeRequest('DELETE', `/collaboration/requests/${id}`),
    approve: (id) => makeRequest('POST', `/collaboration/requests/${id}/approve`, {}),
    reject: (id) => makeRequest('POST', `/collaboration/requests/${id}/reject`, {}),
  },

  // ============ READING HISTORY ============
  readingHistory: {
    getHistory: () => makeRequest('GET', '/reading-history'),
    getUserHistory: (userId) => makeRequest('GET', `/reading-history/user/${userId}`),
    getContinueReading: () => makeRequest('GET', '/reading-history/continue'),
    getProjectHistory: (projectId) => makeRequest('GET', `/reading-history/project/${projectId}`),
    save: (data) => makeRequest('POST', '/reading-history', data),
    delete: (projectId, chapterId) => makeRequest('DELETE', `/reading-history/${projectId}/${chapterId}`),
    clearAll: () => makeRequest('DELETE', '/reading-history'),
  },

  // ============ REPORTS ============
  reports: {
    getAll: () => makeRequest( 'GET', '/reports'),
    create: (data) => makeRequest('POST', '/reports',data),
    delete: (id) => makeRequest('DELETE', `/reports/${id}`),
  },
};

// ============ UTILITY FUNCTIONS ============

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

