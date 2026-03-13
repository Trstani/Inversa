import { API_BASE_URL, saveToLocalStorage, loadFromLocalStorage } from "./storageUtils";
import { loadProjects } from "./projectManager";

// =======================
// CHAPTERS
// =======================

export const loadChapters = async (projectId = null) => {

    try {

        const url = projectId
            ? `${API_BASE_URL}/chapters?projectId=${projectId}`
            : `${API_BASE_URL}/chapters`;

        const response = await fetch(url, { signal: AbortSignal.timeout(2000) });

        if (response.ok) {

            const data = await response.json();
            return data?.chapters || [];

        }

    } catch (error) {

        console.warn("API unavailable, using localStorage");

    }

    const data = loadFromLocalStorage("chapters");
    const allChapters = data?.chapters || [];

    if (projectId) {
        return allChapters.filter(c => c.projectId === parseInt(projectId));
    }

    return allChapters;

};


// =======================
// LOCK CHAPTER
// =======================

export const lockChapter = (chapterId, userId) => {

    const data = loadFromLocalStorage("chapters");

    if (!data?.chapters) return;

    const chapters = data.chapters;

    const LOCK_TIMEOUT = 1000 * 60 * 10; // 10 menit

    const updated = chapters.map((chapter) => {

        if (chapter.id === chapterId) {

            if (chapter.lockedBy && chapter.lockedBy !== userId) {

                const expired = Date.now() - chapter.lockedAt > LOCK_TIMEOUT;

                if (!expired) {
                    throw new Error("Chapter sedang diedit user lain");
                }

            }

            return {
                ...chapter,
                lockedBy: userId,
                lockedAt: Date.now(),
            };

        }

        return chapter;

    });

    saveToLocalStorage("chapters", { chapters: updated });

};


// =======================
// UNLOCK CHAPTER
// =======================

export const unlockChapter = (chapterId, userId) => {

    const data = loadFromLocalStorage("chapters");

    if (!data?.chapters) return;

    const chapters = data.chapters;

    const updated = chapters.map((chapter) => {

        if (chapter.id === chapterId && chapter.lockedBy === userId) {

            return {
                ...chapter,
                lockedBy: null,
                lockedAt: null,
            };

        }

        return chapter;

    });

    saveToLocalStorage("chapters", { chapters: updated });

};


// =======================
// SAVE CHAPTER
// =======================

export const saveChapter = async (chapter) => {

    try {

        const method = chapter.id ? "PUT" : "POST";

        const url = chapter.id
            ? `${API_BASE_URL}/chapters/${chapter.id}`
            : `${API_BASE_URL}/chapters`;

        const response = await fetch(url, {

            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chapter),
            signal: AbortSignal.timeout(2000),

        });

        if (response.ok) {

            return await loadChapters();

        }

    } catch (error) {

        console.warn("API unavailable, using localStorage");

    }

    const chapters = await loadChapters();

    const existingIndex = chapters.findIndex(c => c.id === chapter.id);

    if (existingIndex >= 0) {

        chapters[existingIndex] = {
            ...chapters[existingIndex],
            ...chapter,
            lockedBy: chapters[existingIndex].lockedBy || null,
            lockedAt: chapters[existingIndex].lockedAt || null,
            updatedAt: new Date().toISOString(),
        };

    } else {

        const projectChapters = await loadChapters(chapter.projectId);

        const newChapter = {

            ...chapter,
            id: Date.now(),
            chapterNumber: projectChapters.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: [],

        };

        chapters.push(newChapter);

        const projects = await loadProjects();

        const projectIndex = projects.findIndex(p => p.id === chapter.projectId);

        if (projectIndex >= 0) {

            projects[projectIndex].totalChapters = projectChapters.length + 1;
            projects[projectIndex].updatedAt = new Date().toISOString();

            saveToLocalStorage("projects", { projects });

        }

    }

    saveToLocalStorage("chapters", { chapters });

    return chapters;

};


// =======================
// DELETE CHAPTER
// =======================

export const deleteChapter = async (id) => {

    try {

        const response = await fetch(`${API_BASE_URL}/chapters/${id}`, {
            method: "DELETE",
            signal: AbortSignal.timeout(2000),
        });

        if (response.ok) {

            return await loadChapters();

        }

    } catch (error) {

        console.warn("API unavailable, using localStorage");

    }

    const chapters = await loadChapters();

    const filtered = chapters.filter(c => c.id !== id);

    saveToLocalStorage("chapters", { chapters: filtered });

    return filtered;

};


// =======================
// GET CHAPTER BY ID
// =======================

export const getChapterById = async (projectId, chapterId) => {

    const chapters = await loadChapters(projectId);

    return chapters.find(c => c.id === parseInt(chapterId));

};


// =======================
// GET CHAPTER BY NUMBER
// =======================

export const getChapterByNumber = async (projectId, chapterNumber) => {

    const chapters = await loadChapters(projectId);

    return chapters.find(c => c.chapterNumber === parseInt(chapterNumber));

};