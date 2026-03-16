import { loadFromLocalStorage, saveToLocalStorage } from "./storageUtils";
import { loadProjects } from "./projectManager";
import { loadChapters } from "./chapterManager";


// ==============================
// LOAD READING HISTORY
// ==============================

export const loadReadingHistory = (userId) => {

  const data = loadFromLocalStorage("readingHistory");

  const history = data?.history || [];

  return history.filter(
    h => h.userId === userId
  );

};



// ==============================
// SAVE READING HISTORY
// ==============================

export const saveReadingHistory = (userId, projectId, chapterId) => {

  const data = loadFromLocalStorage("readingHistory");

  const history = data?.history || [];

  const existingIndex = history.findIndex(
    h => h.userId === userId && h.projectId === projectId
  );

  const newEntry = {

    id: Date.now(),

    userId,

    projectId,

    chapterId,

    updatedAt: new Date().toISOString()

  };

  if (existingIndex >= 0) {

    history[existingIndex] = {
      ...history[existingIndex],
      chapterId,
      updatedAt: new Date().toISOString()
    };

  } else {

    history.push(newEntry);

  }

  saveToLocalStorage("readingHistory", { history });

  return history;

};



// ==============================
// CONTINUE READING
// ==============================

export const getContinueReading = async (userId) => {

  const history = loadReadingHistory(userId);

  const projects = await loadProjects();
  const chapters = await loadChapters();

  const sortedHistory = history.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  const continueReading = sortedHistory.map(entry => {

    const project = projects.find(
      p => p.id === entry.projectId
    );

    const chapter = chapters.find(
      c => c.id === entry.chapterId
    );

    if (!project || !chapter) return null;

    return {

      ...entry,

      projectTitle: project.title,

      chapterTitle: chapter.title,

      projectCover: project.coverImage

    };

  }).filter(Boolean);

  return continueReading;

};