import { saveToLocalStorage, loadFromLocalStorage } from "./storageUtils";
import { loadProjects } from "./projectManager";
import { loadChapters } from "./chapterManager";

const USERS_KEY = "users";

const getAllUsers = () => {
  return loadFromLocalStorage(USERS_KEY) || [];
};

const saveUsers = (users) => {
  saveToLocalStorage(USERS_KEY, users);
};

/*
=========================
UPDATE READING HISTORY
=========================
*/

export const updateReadingHistory = (userId, projectId, chapterId) => {

  const users = getAllUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return;

  if (!user.readingHistory) {
    user.readingHistory = [];
  }

  const existing = user.readingHistory.find(
    h => h.projectId === projectId
  );

  if (existing) {

    existing.chapterId = chapterId;
    existing.lastReadAt = new Date().toISOString();

  } else {

    user.readingHistory.push({
      projectId,
      chapterId,
      lastReadAt: new Date().toISOString()
    });

  }

  user.readingHistory =
    user.readingHistory
      .sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt))
      .slice(0, 10);

  saveUsers(users);

};

/*
=========================
LOAD READING HISTORY
=========================
*/

export const loadReadingHistory = (userId) => {

  const users = getAllUsers();
  const user = users.find(u => u.id === userId);

  if (!user || !user.readingHistory) {
    return [];
  }

  return user.readingHistory;

};

/*
=========================
CONTINUE READING
=========================
*/

export const getContinueReading = async (userId) => {

  const history = loadReadingHistory(userId);

  if (!history || history.length === 0) {
    return null;
  }

  const latest = history[0];

  const projects = await loadProjects();
  const project = projects.find(p => p.id === latest.projectId);

  if (!project) return null;

  const chapters = await loadChapters(project.id);
  const chapter = chapters.find(c => c.id === latest.chapterId);

  if (!chapter) return null;

  return {
    project,
    chapter
  };

};