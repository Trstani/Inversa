/*
// User Manager - Simple user database using localStorage + JSON
// Stores user credentials and profile data

const USERS_KEY = 'inversa_users';
const USERS_JSON_URL = '/data/users.json';

// ==============================
// PASSWORD HASH
// ==============================

// Simple password hashing (development only)
const hashPassword = (password) => {

    let hash = 0;

    for (let i = 0; i < password.length; i++) {

        const char = password.charCodeAt(i);

        hash = ((hash << 5) - hash) + char;

        hash = hash & hash;

    }

    return 'hash_' + Math.abs(hash).toString(36);

};

const verifyPassword = (password, hash) => {

    return hashPassword(password) === hash;

};

// ==============================
// JSON STORAGE
// ==============================

const loadUsersFromJSON = async () => {

    try {

        const response = await fetch(USERS_JSON_URL);

        if (response.ok) {

            const data = await response.json();

            return data.users || [];

        }

    } catch (error) {

        console.warn('Failed to load users from JSON');

    }

    return [];

};

const saveUsersToJSON = async (users) => {

    try {

        const response = await fetch('/api/users', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ users }),

            signal: AbortSignal.timeout(2000),

        });

        if (response.ok) {

            return true;

        }

    } catch (error) {

        console.warn('API unavailable, saving to localStorage only');

    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return true;

};

// ==============================
// DEFAULT USERS
// ==============================

const initializeDefaultUsers = async () => {

    const existingUsers = localStorage.getItem(USERS_KEY);

    if (!existingUsers) {

        const defaultUsers = await loadUsersFromJSON();

        if (defaultUsers.length > 0) {

            localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));

        } else {

            const fallbackUsers = [

                {
                    id: 1,
                    name: 'Admin',
                    email: 'admin@inversa.com',
                    password: hashPassword('admin123'),
                    role: 'admin',
                    avatar: null,
                    createdAt: new Date().toISOString(),

                    following: [],
                    followers: [],
                    readingHistory: [],
                    bookmarkedProjects: []
                },

                {
                    id: 2,
                    name: 'Demo User',
                    email: 'demo@example.com',
                    password: hashPassword('demo123'),
                    role: 'user',
                    avatar: null,
                    createdAt: new Date().toISOString(),

                    following: [],
                    followers: [],
                    readingHistory: [],
                    bookmarkedProjects: []
                }

            ];

            localStorage.setItem(USERS_KEY, JSON.stringify(fallbackUsers));

        }

    }

};

// ==============================
// BASIC STORAGE
// ==============================

const getAllUsers = () => {

    const users = localStorage.getItem(USERS_KEY);

    return users ? JSON.parse(users) : [];

};

const saveUsers = (users) => {

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    saveUsersToJSON(users);

};

// ==============================
// FIND USERS
// ==============================

export const findUserByEmail = (email) => {

    const users = getAllUsers();

    return users.find(u => u.email.toLowerCase() === email.toLowerCase());

};

export const findUserById = (id) => {

    const users = getAllUsers();

    return users.find(u => u.id === id);

};

export const getAllUsersSync = () => {

    return getAllUsers();

};

// ==============================
// REGISTER
// ==============================

export const registerUser = (name, email, password) => {

    const users = getAllUsers();

    if (findUserByEmail(email)) {

        return { success: false, error: 'Email already registered' };

    }

    const newUser = {

        id: Date.now() + Math.random(),

        name: name.trim(),

        email: email.toLowerCase().trim(),

        password: hashPassword(password),

        role: 'user',

        avatar: null,

        createdAt: new Date().toISOString(),

        following: [],

        followers: [],

        readingHistory: [],

        bookmarkedProjects: []

    };

    users.push(newUser);

    saveUsers(users);

    return {

        success: true,

        user: {

            id: newUser.id,

            name: newUser.name,

            email: newUser.email,

            role: newUser.role,

            avatar: newUser.avatar,

            createdAt: newUser.createdAt

        }

    };

};

// ==============================
// LOGIN
// ==============================

export const loginUser = (email, password) => {

    const user = findUserByEmail(email);

    if (!user) {

        return { success: false, error: 'User not found' };

    }

    if (!verifyPassword(password, user.password)) {

        return { success: false, error: 'Invalid password' };

    }

    return {

        success: true,

        user: {

            id: user.id,

            name: user.name,

            email: user.email,

            role: user.role,

            avatar: user.avatar,

            createdAt: user.createdAt

        }

    };

};

// ==============================
// PROFILE UPDATE
// ==============================

export const updateUserProfile = (userId, updates) => {

    const users = getAllUsers();

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex < 0) {

        return { success: false, error: 'User not found' };

    }

    users[userIndex] = {

        ...users[userIndex],

        ...updates,

        id: users[userIndex].id,

        email: users[userIndex].email,

        createdAt: users[userIndex].createdAt,

    };

    saveUsers(users);

    return {

        success: true,

        user: {

            id: users[userIndex].id,

            name: users[userIndex].name,

            email: users[userIndex].email,

            role: users[userIndex].role,

            avatar: users[userIndex].avatar,

            createdAt: users[userIndex].createdAt,

        }

    };

};

// ==============================
// FOLLOW SYSTEM
// ==============================

export const followUser = (currentUserId, targetUserId) => {

    const users = getAllUsers();

    const currentUser = users.find(u => u.id === currentUserId);

    const targetUser = users.find(u => u.id === targetUserId);

    if (!currentUser || !targetUser) return;

    if (!currentUser.following.includes(targetUserId)) {

        currentUser.following.push(targetUserId);

    }

    if (!targetUser.followers.includes(currentUserId)) {

        targetUser.followers.push(currentUserId);

    }

    saveUsers(users);

};

export const unfollowUser = (currentUserId, targetUserId) => {

    const users = getAllUsers();

    const currentUser = users.find(u => u.id === currentUserId);

    const targetUser = users.find(u => u.id === targetUserId);

    if (!currentUser || !targetUser) return;

    currentUser.following =
        currentUser.following.filter(id => id !== targetUserId);

    targetUser.followers =
        targetUser.followers.filter(id => id !== currentUserId);

    saveUsers(users);

};

// ==============================
// READING HISTORY
// ==============================

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

export const getReadingHistory = (userId) => {

    const user = findUserById(userId);

    return user?.readingHistory || [];

};

// ==============================
// BOOKMARK PROJECT
// ==============================

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

// ==============================
// USER STATS (BASIC)
// ==============================

export const getUserStats = (userId) => {

    return {

        userId,

        projectsCreated: 0,

        chaptersWritten: 0,

        collaborations: 0,

    };

};

// ==============================
// ADMIN
// ==============================

export const listAllUsers = () => {

    const users = getAllUsers();

    return users.map(u => ({

        id: u.id,

        name: u.name,

        email: u.email,

        role: u.role,

        createdAt: u.createdAt,

    }));

};

// ==============================
// INIT
// ==============================

initializeDefaultUsers();

*/