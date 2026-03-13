import { loadFromLocalStorage, saveToLocalStorage } from "./storageUtils";
import { loadProjects } from "./projectManager";

const FOLLOW_KEY = "projectFollows";

/*
=========================
LOAD ALL FOLLOWS
=========================
*/

const loadAllFollows = () => {
  return loadFromLocalStorage(FOLLOW_KEY) || [];
};

const saveFollows = (follows) => {
  saveToLocalStorage(FOLLOW_KEY, follows);
};

/*
=========================
FOLLOW PROJECT
=========================
*/

export const followProject = (userId, projectId) => {

  const follows = loadAllFollows();

  const exists = follows.find(
    f => f.userId === userId && f.projectId === projectId
  );

  if (exists) return;

  follows.push({
    id: Date.now(),
    userId,
    projectId,
    createdAt: new Date().toISOString()
  });

  saveFollows(follows);

};

/*
=========================
UNFOLLOW PROJECT
=========================
*/

export const unfollowProject = (userId, projectId) => {

  const follows = loadAllFollows();

  const updated = follows.filter(
    f => !(f.userId === userId && f.projectId === projectId)
  );

  saveFollows(updated);

};

/*
=========================
CHECK FOLLOW
=========================
*/

export const isProjectFollowed = (userId, projectId) => {

  const follows = loadAllFollows();

  return follows.some(
    f => f.userId === userId && f.projectId === projectId
  );

};

/*
=========================
LOAD FOLLOWED PROJECTS
=========================
*/

export const loadFollowedProjects = (userId) => {

  const follows = loadAllFollows();

  const projectIds = follows
    .filter(f => f.userId === userId)
    .map(f => f.projectId);

  const projects = loadProjects();

  return projects.filter(p => projectIds.includes(p.id));

};