// Team Request Manager - Handle team join requests

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(`inversa_${key}`, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(`inversa_${key}`);
  return data ? JSON.parse(data) : null;
};

// ============= TEAM JOIN REQUESTS =============

export const loadTeamRequests = async (teamId = null) => {
  const data = loadFromLocalStorage('teamRequests');
  const requests = data?.requests || [];

  if (teamId) {
    return requests.filter(r => r.teamId === parseInt(teamId));
  }

  return requests;
};

export const saveTeamRequest = async (request) => {
  const requests = await loadTeamRequests();

  // Check if user already has a pending request for this team
  const existingRequest = requests.find(
    r => r.teamId === request.teamId && 
         r.userId === request.userId && 
         r.status === 'pending'
  );

  if (existingRequest) {
    return requests; // Don't create duplicate request
  }

  const newRequest = {
    ...request,
    id: Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  requests.push(newRequest);
  saveToLocalStorage('teamRequests', { requests });

  return requests;
};

export const updateTeamRequest = async (id, status, role = null) => {
  const requests = await loadTeamRequests();
  const requestIndex = requests.findIndex(r => r.id === id);

  if (requestIndex >= 0) {
    requests[requestIndex].status = status;
    
    if (role) {
      requests[requestIndex].role = role;
    }

    requests[requestIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('teamRequests', { requests });
  }

  return requests;
};

export const deleteTeamRequest = async (id) => {
  const requests = await loadTeamRequests();
  const filtered = requests.filter(r => r.id !== id);
  saveToLocalStorage('teamRequests', { requests: filtered });
  return filtered;
};

export const getTeamRequestsByTeam = async (teamId) => {
  const requests = await loadTeamRequests();
  return requests.filter(r => r.teamId === parseInt(teamId));
};

export const getUserTeamRequests = async (userId) => {
  const requests = await loadTeamRequests();
  return requests.filter(r => r.userId === userId);
};

export const getPendingTeamRequests = async (teamId) => {
  const requests = await loadTeamRequests();
  return requests.filter(
    r => r.teamId === parseInt(teamId) && r.status === 'pending'
  );
};
