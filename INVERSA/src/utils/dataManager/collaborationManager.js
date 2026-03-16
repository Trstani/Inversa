import { API_BASE_URL, saveToLocalStorage, loadFromLocalStorage } from "./storageUtils";
import { loadProjects } from "./projectManager";


// ============= COLLABORATION REQUESTS =============

export const loadCollaborationRequests = async (projectId = null) => {

  try {

    const url = projectId
      ? `${API_BASE_URL}/collaborations?projectId=${projectId}`
      : `${API_BASE_URL}/collaborations`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(2000)
    });

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

    return allRequests.filter(
      r => r.projectId === parseInt(projectId)
    );

  }

  return allRequests;

};



// ==============================
// SAVE COLLAB REQUEST
// ==============================

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



// ==============================
// UPDATE REQUEST
// ==============================

export const updateCollaborationRequest = async (id, status, role = null) => {

  try {

    const requests = await loadCollaborationRequests();

    const request = requests.find(
      r => r.id === id
    );

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

  const requestIndex = requests.findIndex(
    r => r.id === id
  );

  if (requestIndex >= 0) {

    requests[requestIndex].status = status;

    if (status === 'approved') {

      const request = requests[requestIndex];

      const projects = await loadProjects();

      const projectIndex = projects.findIndex(
        p => p.id === request.projectId
      );

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



// ==============================
// DELETE REQUEST
// ==============================

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

  const filtered = requests.filter(
    r => r.id !== id
  );

  saveToLocalStorage('collaborations', { requests: filtered });

  return filtered;

};