// User Manager - Simple user database using localStorage + JSON
// Stores user credentials and profile data

const USERS_KEY = 'inversa_users';
const USERS_JSON_URL = '/data/users.json';

// Simple password hashing (for development - use bcrypt in production)
const hashPassword = (password) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return 'hash_' + Math.abs(hash).toString(36);
};

// Verify password against hash
const verifyPassword = (password, hash) => {
    return hashPassword(password) === hash;
};

// Load users dari JSON
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

// Save users ke JSON (via API jika available, atau localStorage)
const saveUsersToJSON = async (users) => {
    try {
        // Try save via API
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
    
    // Fallback: save to localStorage
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
};

// Initialize default users
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
                    name: 'Demo User',
                    email: 'demo@example.com',
                    password: 'demo123',
                    role: 'user',
                    avatar: null,
                    createdAt: new Date().toISOString(),
                },
            ];
            localStorage.setItem(USERS_KEY, JSON.stringify(fallbackUsers));
        }
    }
};

// Get all users
const getAllUsers = () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

// Save users
const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    // Also try to save to JSON
    saveUsersToJSON(users);
};

// Find user by email
export const findUserByEmail = (email) => {
    const users = getAllUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Find user by ID
export const findUserById = (id) => {
    const users = getAllUsers();
    return users.find(u => u.id === id);
};

// Get all users (for display)
export const getAllUsersSync = () => {
    return getAllUsers();
};

// Register new user
export const registerUser = (name, email, password) => {
    const users = getAllUsers();
    
    // Check if user already exists
    if (findUserByEmail(email)) {
        return { success: false, error: 'Email already registered' };
    }
    
    // Create new user with hashed password
    const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashPassword(password), // Hash password
        role: 'user',
        avatar: null,
        createdAt: new Date().toISOString(),
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
            createdAt: newUser.createdAt,
        }
    };
};

// Login user
export const loginUser = (email, password) => {
    const user = findUserByEmail(email);
    
    if (!user) {
        return { success: false, error: 'User not found' };
    }
    
    // Verify hashed password
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
            createdAt: user.createdAt,
        }
    };
};

// Update user profile
export const updateUserProfile = (userId, updates) => {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex < 0) {
        return { success: false, error: 'User not found' };
    }
    
    users[userIndex] = {
        ...users[userIndex],
        ...updates,
        id: users[userIndex].id, // Don't allow ID change
        email: users[userIndex].email, // Don't allow email change
        createdAt: users[userIndex].createdAt, // Don't allow date change
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

// Get user stats
export const getUserStats = (userId) => {
    return {
        userId,
        projectsCreated: 0,
        chaptersWritten: 0,
        collaborations: 0,
    };
};

// List all users (for admin)
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

// Initialize on load
initializeDefaultUsers();
