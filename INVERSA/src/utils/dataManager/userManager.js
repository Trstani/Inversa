import { saveToLocalStorage, loadFromLocalStorage } from './storageUtils';

const USERS_KEY = "users";

export const getAllUsers = () => {
    return loadFromLocalStorage(USERS_KEY) || [];
};

export const saveUsers = (users) => {
    saveToLocalStorage(USERS_KEY, users);
};

export const findUserByEmail = (email) => {

    const users = getAllUsers();

    return users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

};

export const findUserById = (id) => {

    const users = getAllUsers();

    return users.find(u => u.id === id);

};

export const updateUserProfile = (userId, updates) => {

    const users = getAllUsers();

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex < 0) {
        return { success: false, error: "User not found" };
    }

    users[userIndex] = {
        ...users[userIndex],
        ...updates,
        id: users[userIndex].id,
        email: users[userIndex].email,
        createdAt: users[userIndex].createdAt,
    };

    saveUsers(users);

    return { success: true, user: users[userIndex] };

};