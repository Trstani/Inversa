import { getAllUsers, saveUsers, hashPassword, verifyPassword } from "./userStorage";

export const findUserByEmail = (email) => {

  const users = getAllUsers();

  return users.find(u => u.email.toLowerCase() === email.toLowerCase());

};

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