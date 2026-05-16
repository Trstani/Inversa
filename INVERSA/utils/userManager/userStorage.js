const USERS_KEY = 'inversa_users';
const USERS_JSON_URL = '/data/users.json';

// ==============================
// PASSWORD HASH
// ==============================

export const hashPassword = (password) => {

  let hash = 0;

  for (let i = 0; i < password.length; i++) {

    const char = password.charCodeAt(i);

    hash = ((hash << 5) - hash) + char;

    hash = hash & hash;

  }

  return 'hash_' + Math.abs(hash).toString(36);

};

export const verifyPassword = (password, hash) => {

  return hashPassword(password) === hash;

};

// ==============================
// JSON STORAGE
// ==============================

export const loadUsersFromJSON = async () => {

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

export const saveUsersToJSON = async (users) => {

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
// BASIC STORAGE
// ==============================

export const getAllUsers = () => {

  const users = localStorage.getItem(USERS_KEY);

  return users ? JSON.parse(users) : [];

};

export const saveUsers = (users) => {

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  saveUsersToJSON(users);

};

// ==============================
// DUMMY USERS INITIALIZER
// ==============================

export const initializeDummyUsers = () => {

  const existingUsers = getAllUsers();

  if (existingUsers.length > 0) {
    return existingUsers;
  }

  const dummyUsers = [
    {
      id: 1001,
      name: "Demo User 1",
      email: "demo1@inversa.com",
      password: hashPassword("demo123"),
      role: "user",
      createdAt: new Date().toISOString(),
      followers: [],
      following: []
    },
    {
      id: 1002,
      name: "Demo User 2",
      email: "demo2@lego.com",
      password: hashPassword("demo123"),
      role: "user",
      createdAt: new Date().toISOString(),
      followers: [],
      following: []
    },
    {
      id: 1003,
      name: "Admin",
      email: "admin@inversa.com",
      password: hashPassword("admin123"),
      role: "admin",
      createdAt: new Date().toISOString(),
      followers: [],
      following: []
    }
  ];

  saveUsers(dummyUsers);

  return dummyUsers;

};