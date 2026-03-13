import { API_BASE_URL, saveToLocalStorage, loadFromLocalStorage } from "./storageUtils";

// =======================
// LOAD PROJECTS
// =======================

export const loadProjects = async () => {

    try {

        const response = await fetch(`${API_BASE_URL}/projects`, {
            signal: AbortSignal.timeout(2000)
        });

        if (response.ok) {
            const data = await response.json();
            return data?.projects || [];
        }

    } catch (error) {
        console.warn("API unavailable, using localStorage");
    }

    const data = loadFromLocalStorage("projects");
    return data?.projects || [];
};


// =======================
// SAVE PROJECT
// =======================

export const saveProject = async (project) => {

    try {

        const method = project.id ? "PUT" : "POST";

        const url = project.id
            ? `${API_BASE_URL}/projects/${project.id}`
            : `${API_BASE_URL}/projects`;

        const response = await fetch(url, {

            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
            signal: AbortSignal.timeout(2000)

        });

        if (response.ok) {
            return await loadProjects();
        }

    } catch (error) {
        console.warn("API unavailable, using localStorage");
    }

    const projects = await loadProjects();

    const existingIndex = projects.findIndex(p => p.id === project.id);

    if (existingIndex >= 0) {

        projects[existingIndex] = {
            ...projects[existingIndex],
            ...project,
            updatedAt: new Date().toISOString()
        };

    } else {

        const newProject = {
            ...project,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            totalChapters: 0,
            likes: 0,
            views: 0,
            collaborators: []
        };

        projects.push(newProject);

    }

    saveToLocalStorage("projects", { projects });

    return projects;

};


// =======================
// DELETE PROJECT
// =======================

export const deleteProject = async (id) => {

    try {

        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: "DELETE",
            signal: AbortSignal.timeout(2000)
        });

        if (response.ok) {
            return await loadProjects();
        }

    } catch (error) {
        console.warn("API unavailable, using localStorage");
    }

    const projects = await loadProjects();

    const filtered = projects.filter(p => p.id !== id);

    saveToLocalStorage("projects", { projects: filtered });

    return filtered;

};


// =======================
// GET PROJECT BY ID
// =======================

export const getProjectById = async (id) => {

    const projects = await loadProjects();

    return projects.find(p => p.id === parseInt(id));

};


// =======================
// HIDE PROJECT
// =======================

export const hideProject = async (projectId) => {

    const projects = await loadProjects();

    const updated = projects.map(project => {

        if (project.id === projectId) {

            return {
                ...project,
                hidden: true
            };

        }

        return project;

    });

    saveToLocalStorage("projects", { projects: updated });

    return updated;

};


// =======================
// LIKE SYSTEM
// =======================

export const incrementLikes = async (projectId) => {

    const projects = await loadProjects();

    const updated = projects.map(project => {

        if (project.id === projectId) {

            return {
                ...project,
                likes: (project.likes || 0) + 1
            };

        }

        return project;

    });

    saveToLocalStorage("projects", { projects: updated });

    return updated;

};


export const decrementLikes = async (projectId) => {

    const projects = await loadProjects();

    const updated = projects.map(project => {

        if (project.id === projectId) {

            return {
                ...project,
                likes: Math.max((project.likes || 0) - 1, 0)
            };

        }

        return project;

    });

    saveToLocalStorage("projects", { projects: updated });

    return updated;

};


// =======================
// VIEW COUNTER
// =======================

export const incrementViews = async (projectId) => {

    const projects = await loadProjects();

    const updated = projects.map(project => {

        if (project.id === projectId) {

            return {
                ...project,
                views: (project.views || 0) + 1
            };

        }

        return project;

    });

    saveToLocalStorage("projects", { projects: updated });

    return updated;

};