import { saveToLocalStorage, loadFromLocalStorage } from "./storageUtils";

const USERS_KEY = "users";

const getAllUsers = () => {
    return loadFromLocalStorage(USERS_KEY) || [];
};

const saveUsers = (users) => {
    saveToLocalStorage(USERS_KEY, users);
};

export const updateReadingHistory = (userId, projectId, chapterId) => {

    const users = getAllUsers();

    const user = users.find(u => u.id === userId);

    if (!user) return;

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