import { getAllUsers, saveUsers } from "./userStorage";

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