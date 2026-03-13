import { saveToLocalStorage, loadFromLocalStorage } from "./storageUtils";

const USERS_KEY = "users";

const getAllUsers = () => {
    return loadFromLocalStorage(USERS_KEY) || [];
};

const saveUsers = (users) => {
    saveToLocalStorage(USERS_KEY, users);
};

export const bookmarkProject = (userId, projectId) => {

    const users = getAllUsers();

    const user = users.find(u => u.id === userId);

    if (!user) return;

    if (!user.bookmarkedProjects.includes(projectId)) {

        user.bookmarkedProjects.push(projectId);

    }

    saveUsers(users);

};

export const removeBookmark = (userId, projectId) => {

    const users = getAllUsers();

    const user = users.find(u => u.id === userId);

    if (!user) return;

    user.bookmarkedProjects =
        user.bookmarkedProjects.filter(p => p !== projectId);

    saveUsers(users);

};