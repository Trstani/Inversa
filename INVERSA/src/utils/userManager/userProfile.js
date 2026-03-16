import { getAllUsers, saveUsers } from "./userStorage";

export const findUserById = (id) => {

  const users = getAllUsers();

  return users.find(u => u.id === id);

};

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