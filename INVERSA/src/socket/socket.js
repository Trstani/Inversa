import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket = null;

export const initSocket = () => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('connect_error', (error) => {
    console.error(
      'Socket connect error:',
      error
    );
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ============ BRAINSTORM EVENTS ============

export const joinBrainstormRoom = (projectId, userId) => {
  const socket = getSocket();
  socket.emit('join_brainstorm', { projectId, userId });
};

export const leaveBrainstormRoom = (projectId) => {
  const socket = getSocket();
  socket.emit('leave_brainstorm', { projectId });
};

// ============ IDEA EVENTS ============

export const emitIdeaAdded = (projectId, idea) => {
  const socket = getSocket();
  socket.emit('idea_added', { projectId, idea });
};

export const onIdeaAdded = (callback) => {
  const socket = getSocket();
  socket.on('idea_added', callback);
};

export const emitIdeaDeleted = (projectId, ideaId) => {
  const socket = getSocket();
  socket.emit('idea_deleted', { projectId, ideaId });
};

export const onIdeaDeleted = (callback) => {
  const socket = getSocket();
  socket.on('idea_deleted', callback);
};

export const emitIdeaVoted = (projectId, ideaId, userId) => {
  const socket = getSocket();
  socket.emit('idea_voted', { projectId, ideaId, userId });
};

export const onIdeaVoted = (callback) => {
  const socket = getSocket();
  socket.on('idea_voted', callback);
};

// ============ DISCUSSION EVENTS ============

export const emitDiscussionAdded = (projectId, discussion) => {
  const socket = getSocket();
  socket.emit('discussion_added', { projectId, discussion });
};

export const onDiscussionAdded = (callback) => {
  const socket = getSocket();
  socket.on('discussion_added', callback);
};

export const emitDiscussionDeleted = (projectId, discussionId) => {
  const socket = getSocket();
  socket.emit('discussion_deleted', { projectId, discussionId });
};

export const onDiscussionDeleted = (callback) => {
  const socket = getSocket();
  socket.on('discussion_deleted', callback);
};

// ============ NOTES EVENTS ============

export const emitNoteAdded = (projectId, note) => {
  const socket = getSocket();
  socket.emit('note_added', { projectId, note });
};

export const onNoteAdded = (callback) => {
  const socket = getSocket();
  socket.on('note_added', callback);
};

export const emitNoteDeleted = (projectId, noteId) => {
  const socket = getSocket();
  socket.emit('note_deleted', { projectId, noteId });
};

export const onNoteDeleted = (callback) => {
  const socket = getSocket();
  socket.on('note_deleted', callback);
};

// ============ TASK EVENTS ============

export const emitTaskAdded = (projectId, task) => {
  const socket = getSocket();
  socket.emit('task_added', { projectId, task });
};

export const onTaskAdded = (callback) => {
  const socket = getSocket();
  socket.on('task_added', callback);
};

export const emitTaskUpdated = (projectId, taskId, updates) => {
  const socket = getSocket();
  socket.emit('task_updated', { projectId, taskId, updates });
};

export const onTaskUpdated = (callback) => {
  const socket = getSocket();
  socket.on('task_updated', callback);
};

export const emitTaskDeleted = (projectId, taskId) => {
  const socket = getSocket();
  socket.emit('task_deleted', { projectId, taskId });
};

export const onTaskDeleted = (callback) => {
  const socket = getSocket();
  socket.on('task_deleted', callback);
};

// ============ CLEANUP ============

export const offIdeaAdded = (callback) => {
  const socket = getSocket();
  socket.off('idea_added', callback);
};

export const offIdeaDeleted = (callback) => {
  const socket = getSocket();
  socket.off('idea_deleted', callback);
};

export const offIdeaVoted = (callback) => {
  const socket = getSocket();
  socket.off('idea_voted', callback);
};

export const offDiscussionAdded = (callback) => {
  const socket = getSocket();
  socket.off('discussion_added', callback);
};

export const offDiscussionDeleted = (callback) => {
  const socket = getSocket();
  socket.off('discussion_deleted', callback);
};

export const offNoteAdded = (callback) => {
  const socket = getSocket();
  socket.off('note_added', callback);
};

export const offNoteDeleted = (callback) => {
  const socket = getSocket();
  socket.off('note_deleted', callback);
};

export const offTaskAdded = (callback) => {
  const socket = getSocket();
  socket.off('task_added', callback);
};

export const offTaskUpdated = (callback) => {
  const socket = getSocket();
  socket.off('task_updated', callback);
};

export const offTaskDeleted = (callback) => {
  const socket = getSocket();
  socket.off('task_deleted', callback);
};

export { socket };
