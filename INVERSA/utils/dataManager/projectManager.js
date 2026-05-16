// projectManager.js

import { API_BASE_URL, saveToLocalStorage, loadFromLocalStorage } from "./storageUtils";

// ============= PROJECTS =============

export const loadProjects = async () => {

  try {

    const response = await fetch(`${API_BASE_URL}/projects`, {
      signal: AbortSignal.timeout(2000)
    });

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

// ============= PUBLISHED PROJECTS (for Explorer/Home) =============

export const loadPublishedProjects = async () => {

  try {

    const response = await fetch(`${API_BASE_URL}/projects`, {
      signal: AbortSignal.timeout(2000)
    });

    if (response.ok) {

      const data = await response.json();

      const projects = data?.projects || [];

      // Filter: not hidden AND has published chapters
      return projects.filter(p => !p.hidden && p.hasPublishedChapters);

    }

  } catch (error) {

    console.warn('API unavailable, using localStorage');

  }

  const data = loadFromLocalStorage('projects');

  const projects = data?.projects || [];

  // Filter: not hidden AND has published chapters
  return projects.filter(p => !p.hidden && p.hasPublishedChapters);

};


export const saveProject = async (project) => {

  try {

    const method = project.id ? 'PUT' : 'POST';

    const url = project.id
      ? `${API_BASE_URL}/projects/${project.id}`
      : `${API_BASE_URL}/projects`;

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

  const existingIndex = projects.findIndex(
    p => p.id === project.id
  );

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

      hidden: false,

      isTeamProject: project.isTeamProject || false

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

  const filtered = projects.filter(
    p => p.id !== id
  );

  saveToLocalStorage('projects', { projects: filtered });

  return filtered;

};


export const getProjectById = async (id) => {

  const projects = await loadProjects();

  return projects.find(
    p => p.id === parseInt(id)
  );

};


// ============= PROJECT UTILS =============

export const incrementLikes = async (projectId) => {

  const projects = await loadProjects();

  const project = projects.find(
    p => p.id === projectId
  );

  if (project) {

    project.likes = (project.likes || 0) + 1;

    await saveProject(project);

  }

  return projects;

};


export const decrementLikes = async (projectId) => {

  const projects = await loadProjects();

  const project = projects.find(
    p => p.id === projectId
  );

  if (project) {

    project.likes = Math.max(0, (project.likes || 0) - 1);

    await saveProject(project);

  }

  return projects;

};


export const incrementViews = async (projectId) => {

  const projects = await loadProjects();

  const project = projects.find(
    p => p.id === projectId
  );

  if (project) {

    project.views = (project.views || 0) + 1;

    await saveProject(project);

  }

  return projects;

};


// ============= COLLABORATOR ASSIGNMENT =============

export const assignCollaboratorToChapter = async (
  projectId,
  userId,
  chapterId
) => {

  const projects = await loadProjects();

  const project = projects.find(
    p => p.id === projectId
  );

  if (project) {

    const collaborator = project.collaborators?.find(
      c => c.userId === userId
    );

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