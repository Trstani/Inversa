// Team Manager - Handle team data separately from projects

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(`inversa_${key}`, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(`inversa_${key}`);
  return data ? JSON.parse(data) : null;
};

// ============= TEAMS =============

export const loadTeams = async (userId = null) => {
  const data = loadFromLocalStorage('teams');
  const teams = data?.teams || [];

  if (userId) {
    return teams.filter(t => t.initiatorId === userId || t.collaborators?.some(c => c.userId === userId && c.status === 'approved'));
  }

  return teams;
};

export const getMyCreatedTeams = async (userId) => {
  const teams = await loadTeams();
  return teams.filter(t => t.initiatorId === userId);
};

export const getMyJoinedTeams = async (userId) => {
  const teams = await loadTeams();
  return teams.filter(t => 
    t.collaborators?.some(c => c.userId === userId && c.status === 'approved')
  );
};

export const createTeam = async (teamData, userId) => {
  const teams = await loadTeams();
  
  const newTeam = {
    id: Date.now(),
    title: teamData.title,
    description: teamData.description,
    backgroundImage: teamData.backgroundImage,
    initiatorId: userId,
    collaborators: [
      // ✅ ADD INITIATOR TO COLLABORATORS
      {
        userId,
        role: 'owner',
        status: 'approved',
        joinedAt: new Date().toISOString(),
      }
    ],
    projects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  teams.push(newTeam);
  saveToLocalStorage('teams', { teams });

  return newTeam;
};

export const getTeamById = async (teamId) => {
  const teams = await loadTeams();
  return teams.find(t => t.id === parseInt(teamId));
};

export const updateTeam = async (teamId, updates) => {
  const teams = await loadTeams();
  const teamIndex = teams.findIndex(t => t.id === parseInt(teamId));

  if (teamIndex >= 0) {
    teams[teamIndex] = {
      ...teams[teamIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveToLocalStorage('teams', { teams });
    return teams[teamIndex];
  }

  return null;
};

export const deleteTeam = async (teamId) => {
  const teams = await loadTeams();
  const filtered = teams.filter(t => t.id !== parseInt(teamId));
  saveToLocalStorage('teams', { filtered });
  return filtered;
};

// ============= TEAM COLLABORATORS =============

export const addTeamCollaborator = async (teamId, userId, role = 'member') => {
  const teams = await loadTeams();
  const teamIndex = teams.findIndex(t => t.id === parseInt(teamId));

  if (teamIndex >= 0) {
    const alreadyExists = teams[teamIndex].collaborators?.some(c => c.userId === userId);
    
    if (!alreadyExists) {
      if (!teams[teamIndex].collaborators) {
        teams[teamIndex].collaborators = [];
      }

      teams[teamIndex].collaborators.push({
        userId,
        role,
        status: 'approved',
        joinedAt: new Date().toISOString(),
      });

      teams[teamIndex].updatedAt = new Date().toISOString();
      saveToLocalStorage('teams', { teams });
    }
  }

  return teams;
};

export const removeTeamCollaborator = async (teamId, userId) => {
  const teams = await loadTeams();
  const teamIndex = teams.findIndex(t => t.id === parseInt(teamId));

  if (teamIndex >= 0) {
    teams[teamIndex].collaborators = teams[teamIndex].collaborators?.filter(
      c => c.userId !== userId
    ) || [];

    teams[teamIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('teams', { teams });
  }

  return teams;
};

// ============= TEAM PROJECTS =============

export const addProjectToTeam = async (teamId, projectId) => {
  const teams = await loadTeams();
  const teamIndex = teams.findIndex(t => t.id === parseInt(teamId));

  if (teamIndex >= 0) {
    if (!teams[teamIndex].projects) {
      teams[teamIndex].projects = [];
    }

    const projectIdNum = parseInt(projectId);
    if (!teams[teamIndex].projects.includes(projectIdNum)) {
      teams[teamIndex].projects.push(projectIdNum);
      teams[teamIndex].updatedAt = new Date().toISOString();
      saveToLocalStorage('teams', { teams });
    }
  }

  return teams;
};

export const removeProjectFromTeam = async (teamId, projectId) => {
  const teams = await loadTeams();
  const teamIndex = teams.findIndex(t => t.id === parseInt(teamId));

  if (teamIndex >= 0) {
    teams[teamIndex].projects = teams[teamIndex].projects?.filter(
      p => p !== projectId
    ) || [];

    teams[teamIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('teams', { teams });
  }

  return teams;
};

export const getTeamProjects = async (teamId) => {
  const team = await getTeamById(teamId);
  if (!team) return [];

  // Import loadProjects here to avoid circular dependency
  const { loadProjects } = await import('./projectManager');
  const allProjects = await loadProjects();

  return allProjects.filter(p => team.projects?.includes(parseInt(p.id)));
};
