// Team Project Manager - Handle team-based projects and brainstorming

import { loadProjects, saveProject, loadCollaborationRequests } from './index';

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(`inversa_${key}`, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(`inversa_${key}`);
  return data ? JSON.parse(data) : null;
};

// ============= TEAM PROJECTS =============

export const getMyProjects = async (userId) => {
  const projects = await loadProjects();
  return projects.filter(p => p.initiatorId === userId && !p.isTeamProject);
};

export const getTeamProjects = async (userId) => {
  const { loadTeams, getMyJoinedTeams } = await import('./teamManager');
  
  // Get all teams user is a member of
  const myTeams = await getMyJoinedTeams(userId);
  const myTeamIds = new Set(myTeams.map(t => t.id));
  
  // Get all projects
  const projects = await loadProjects();
  
  // Return projects that belong to teams user is in
  return projects.filter(p => 
    p.isTeamProject && p.teamId && myTeamIds.has(p.teamId)
  );
};

export const createTeamProject = async (projectData, userId, teamId) => {
  const newProject = {
    ...projectData,
    id: Date.now(),
    initiatorId: userId,
    teamId: teamId, // Link project to team
    collaborators: [],
    likes: 0,
    views: 0,
    totalChapters: 0,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hidden: false,
    isTeamProject: true,
  };

  const projects = await loadProjects();
  projects.push(newProject);
  saveToLocalStorage('projects', { projects });

  return newProject;
};

export const inviteCollaboratorsToProject = async (projectId, userIds) => {
  // This function is deprecated - access is now controlled via team membership
  // Keeping for backward compatibility
  return await loadProjects();
};

// ============= BRAINSTORM =============

export const loadBrainstorms = async (projectId = null) => {
  const data = loadFromLocalStorage('brainstorms');
  const brainstorms = data?.brainstorms || [];

  if (projectId) {
    return brainstorms.filter(b => b.projectId === parseInt(projectId));
  }

  return brainstorms;
};

export const getBrainstormByProject = async (projectId) => {
  const brainstorms = await loadBrainstorms();
  let brainstorm = brainstorms.find(b => b.projectId === parseInt(projectId));

  if (!brainstorm) {
    brainstorm = {
      id: Date.now(),
      projectId: parseInt(projectId),
      ideas: [],
      votes: [],
      tasks: [],
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    brainstorms.push(brainstorm);
    saveToLocalStorage('brainstorms', { brainstorms });
  }

  return brainstorm;
};

export const addBrainstormIdea = async (projectId, idea) => {
  const brainstorms = await loadBrainstorms();
  const brainstormIndex = brainstorms.findIndex(b => b.projectId === parseInt(projectId));

  if (brainstormIndex >= 0) {
    const newIdea = {
      id: Date.now(),
      userId: idea.userId,
      userName: idea.userName,
      content: idea.content,
      createdAt: new Date().toISOString(),
    };

    brainstorms[brainstormIndex].ideas.push(newIdea);
    brainstorms[brainstormIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstorms', { brainstorms });

    return brainstorms[brainstormIndex];
  }

  return null;
};

export const addBrainstormVote = async (projectId, ideaId, userId, voteType) => {
  const brainstorms = await loadBrainstorms();
  const brainstormIndex = brainstorms.findIndex(b => b.projectId === parseInt(projectId));

  if (brainstormIndex >= 0) {
    const existingVote = brainstorms[brainstormIndex].votes.find(
      v => v.ideaId === ideaId && v.userId === userId
    );

    if (existingVote) {
      existingVote.voteType = voteType;
    } else {
      brainstorms[brainstormIndex].votes.push({
        id: Date.now(),
        ideaId,
        userId,
        voteType, // 'up' or 'down'
        createdAt: new Date().toISOString(),
      });
    }

    brainstorms[brainstormIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstorms', { brainstorms });

    return brainstorms[brainstormIndex];
  }

  return null;
};

export const addBrainstormTask = async (projectId, task) => {
  const brainstorms = await loadBrainstorms();
  const brainstormIndex = brainstorms.findIndex(b => b.projectId === parseInt(projectId));

  if (brainstormIndex >= 0) {
    const newTask = {
      id: Date.now(),
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo || null,
      status: 'pending', // pending, in-progress, completed
      createdAt: new Date().toISOString(),
    };

    brainstorms[brainstormIndex].tasks.push(newTask);
    brainstorms[brainstormIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstorms', { brainstorms });

    return brainstorms[brainstormIndex];
  }

  return null;
};

export const updateBrainstormTask = async (projectId, taskId, updates) => {
  const brainstorms = await loadBrainstorms();
  const brainstormIndex = brainstorms.findIndex(b => b.projectId === parseInt(projectId));

  if (brainstormIndex >= 0) {
    const taskIndex = brainstorms[brainstormIndex].tasks.findIndex(t => t.id === taskId);

    if (taskIndex >= 0) {
      brainstorms[brainstormIndex].tasks[taskIndex] = {
        ...brainstorms[brainstormIndex].tasks[taskIndex],
        ...updates,
      };

      brainstorms[brainstormIndex].updatedAt = new Date().toISOString();
      saveToLocalStorage('brainstorms', { brainstorms });

      return brainstorms[brainstormIndex];
    }
  }

  return null;
};

export const addBrainstormNote = async (projectId, note) => {
  const brainstorms = await loadBrainstorms();
  const brainstormIndex = brainstorms.findIndex(b => b.projectId === parseInt(projectId));

  if (brainstormIndex >= 0) {
    const newNote = {
      id: Date.now(),
      userId: note.userId,
      userName: note.userName,
      content: note.content,
      createdAt: new Date().toISOString(),
    };

    brainstorms[brainstormIndex].notes.push(newNote);
    brainstorms[brainstormIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstorms', { brainstorms });

    return brainstorms[brainstormIndex];
  }

  return null;
};

export const deleteBrainstormIdea = async (projectId, ideaId) => {
  const brainstorms = await loadBrainstorms();
  const brainstormIndex = brainstorms.findIndex(b => b.projectId === parseInt(projectId));

  if (brainstormIndex >= 0) {
    brainstorms[brainstormIndex].ideas = brainstorms[brainstormIndex].ideas.filter(
      i => i.id !== ideaId
    );
    brainstorms[brainstormIndex].votes = brainstorms[brainstormIndex].votes.filter(
      v => v.ideaId !== ideaId
    );

    brainstorms[brainstormIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstorms', { brainstorms });

    return brainstorms[brainstormIndex];
  }

  return null;
};
