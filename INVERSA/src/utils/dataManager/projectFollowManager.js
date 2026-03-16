import { API_BASE_URL, saveToLocalStorage, loadFromLocalStorage } from "./storageUtils";
import { loadProjects } from "./projectManager";


// ==============================
// LOAD FOLLOWED PROJECTS
// ==============================

export const loadFollowedProjects = async (userId) => {

  try {

    const response = await fetch(`${API_BASE_URL}/follows?userId=${userId}`, {
      signal: AbortSignal.timeout(2000)
    });

    if (response.ok) {

      const data = await response.json();

      return data?.follows || [];

    }

  } catch (error) {

    console.warn('API unavailable, using localStorage');

  }

  const data = loadFromLocalStorage('follows');

  const follows = data?.follows || [];

  return follows.filter(
    f => f.userId === userId
  );

};



// ==============================
// FOLLOW PROJECT
// ==============================

export const followProject = async (userId, projectId) => {

  try {

    const response = await fetch(`${API_BASE_URL}/follows`, {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        userId,
        projectId
      }),

      signal: AbortSignal.timeout(2000)

    });

    if (response.ok) {

      return await loadFollowedProjects(userId);

    }

  } catch (error) {

    console.warn('API unavailable, using localStorage');

  }

  const data = loadFromLocalStorage('follows');

  const follows = data?.follows || [];

  const alreadyFollowed = follows.find(
    f => f.userId === userId && f.projectId === projectId
  );

  if (alreadyFollowed) {

    return follows;

  }

  const newFollow = {

    id: Date.now(),

    userId,

    projectId,

    createdAt: new Date().toISOString()

  };

  follows.push(newFollow);

  saveToLocalStorage('follows', { follows });

  return follows;

};



// ==============================
// UNFOLLOW PROJECT
// ==============================

export const unfollowProject = async (userId, projectId) => {

  try {

    const response = await fetch(`${API_BASE_URL}/follows/${projectId}?userId=${userId}`, {

      method: 'DELETE',

      signal: AbortSignal.timeout(2000)

    });

    if (response.ok) {

      return await loadFollowedProjects(userId);

    }

  } catch (error) {

    console.warn('API unavailable, using localStorage');

  }

  const data = loadFromLocalStorage('follows');

  const follows = data?.follows || [];

  const filtered = follows.filter(
    f => !(f.userId === userId && f.projectId === projectId)
  );

  saveToLocalStorage('follows', { follows: filtered });

  return filtered;

};