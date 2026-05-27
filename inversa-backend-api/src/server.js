import http from 'http';

import app from './app.js';
import env from './config/env.js';

import { Server } from 'socket.io';

const PORT = env.PORT;

const server =
  http.createServer(app);

export const io =
  new Server(server, {

    cors: {
      origin: '*',
      credentials: true,
    },

    transports: ['websocket', 'polling'],

  });

// ============ BRAINSTORM ROOMS ============

const brainstormRooms = new Map();

io.on(
  'connection',
  (socket) => {

    console.log(
      '⚡ User connected:',
      socket.id
    );

    /*
    =========================
    JOIN BRAINSTORM ROOM
    =========================
    */

    socket.on(
      'join_brainstorm',
      ({ projectId, userId }) => {

        const roomName = `brainstorm_${projectId}`;

        socket.join(roomName);

        if (!brainstormRooms.has(roomName)) {
          brainstormRooms.set(roomName, new Set());
        }

        brainstormRooms.get(roomName).add({
          socketId: socket.id,
          userId,
        });

        console.log(
          `👥 User ${userId} joined brainstorm room: ${roomName}`
        );

        // Notify others
        socket.to(roomName).emit(
          'user_joined_brainstorm',
          { userId, socketId: socket.id }
        );

      }
    );

    /*
    =========================
    LEAVE BRAINSTORM ROOM
    =========================
    */

    socket.on(
      'leave_brainstorm',
      ({ projectId }) => {

        const roomName = `brainstorm_${projectId}`;

        socket.leave(roomName);

        if (brainstormRooms.has(roomName)) {
          const room = brainstormRooms.get(roomName);
          room.forEach(user => {
            if (user.socketId === socket.id) {
              room.delete(user);
            }
          });
        }

        console.log(
          `👋 User left brainstorm room: ${roomName}`
        );

        socket.to(roomName).emit(
          'user_left_brainstorm',
          { socketId: socket.id }
        );

      }
    );

    /*
    =========================
    IDEA EVENTS
    =========================
    */

    socket.on(
      'idea_added',
      ({ projectId, idea }) => {

        const roomName = `brainstorm_${projectId}`;

        io.to(roomName).emit(
          'idea_added',
          { idea }
        );

        console.log(
          `💡 Idea added in ${roomName}`
        );

      }
    );

    socket.on(
      'idea_deleted',
      ({ projectId, ideaId }) => {

        const roomName = `brainstorm_${projectId}`;

        io.to(roomName).emit(
          'idea_deleted',
          { ideaId }
        );

        console.log(
          `🗑️ Idea deleted in ${roomName}`
        );

      }
    );

    socket.on(
      'idea_voted',
      ({ projectId, ideaId, userId, voted }) => {

        const roomName = `brainstorm_${projectId}`;

        io.to(roomName).emit(
          'idea_voted',
          { ideaId, userId, voted }
        );

        console.log(
          `👍 Idea voted in ${roomName}`
        );

      }
    );

    /*
    =========================
    DISCUSSION EVENTS
    =========================
    */

    socket.on(
      'discussion_added',
      ({ projectId, discussion }) => {

        const roomName = `brainstorm_${projectId}`;

        io.to(roomName).emit(
          'discussion_added',
          { discussion }
        );

        console.log(
          `💬 Discussion added in ${roomName}`
        );

      }
    );

    socket.on(
      'discussion_deleted',
      ({ projectId, discussionId }) => {

        const roomName = `brainstorm_${projectId}`;

        io.to(roomName).emit(
          'discussion_deleted',
          { discussionId }
        );

        console.log(
          `🗑️ Discussion deleted in ${roomName}`
        );

      }
    );

    /*
=========================
IDEA COMMENTS EVENTS
=========================
*/

    socket.on(
      'idea_comment_added',
      ({ ideaId, comment }) => {

        io.emit(
          'idea_comment_added',
          {
            ideaId,
            comment
          }
        );

        console.log(
          `💬 Comment added for idea ${ideaId}`
        );

      }
    );

    socket.on(
      'idea_comment_deleted',
      ({ ideaId, commentId }) => {

        io.emit(
          'idea_comment_deleted',
          {
            ideaId,
            commentId
          }
        );

        console.log(
          `🗑️ Comment deleted for idea ${ideaId}`
        );

      }
    );

    /*
    =========================
    NOTES EVENTS
    =========================
    */

    socket.on(
      'note_added',
      ({ projectId, note }) => {

        const roomName = `brainstorm_${projectId}`;

        io.to(roomName).emit(
          'note_added',
          { note }
        );

        console.log(
          `📝 Note added in ${roomName}`
        );

      }
    );

    socket.on(
      'note_deleted',
      ({ projectId, noteId }) => {

        const roomName = `brainstorm_${projectId}`;

        io.to(roomName).emit(
          'note_deleted',
          { noteId }
        );

        console.log(
          `🗑️ Note deleted in ${roomName}`
        );

      }
    );

    /*
    =========================
    TASK EVENTS
    =========================
    */

    socket.on(
      'task_added',
      ({ projectId, task }) => {

        const roomName = `brainstorm_${projectId}`;

        io.to(roomName).emit(
          'task_added',
          { task }
        );

        console.log(
          `✅ Task added in ${roomName}`
        );

      }
    );

    socket.on(
      'task_updated',
      ({ projectId, taskId, updates }) => {

        const roomName = `brainstorm_${projectId}`;

        io.to(roomName).emit(
          'task_updated',
          { taskId, updates }
        );

        console.log(
          `🔄 Task updated in ${roomName}`
        );

      }
    );

    socket.on(
      'task_deleted',
      ({ projectId, taskId }) => {

        const roomName = `brainstorm_${projectId}`;

        io.to(roomName).emit(
          'task_deleted',
          { taskId }
        );

        console.log(
          `🗑️ Task deleted in ${roomName}`
        );

      }
    );

    /*
    =========================
    LOCK SECTION
    =========================
    */

    socket.on(
      'lock_section',
      (data) => {

        socket.broadcast.emit(
          'section_locked',
          data
        );

      }
    );

    /*
    =========================
    UNLOCK SECTION
    =========================
    */

    socket.on(
      'unlock_section',
      (data) => {

        socket.broadcast.emit(
          'section_unlocked',
          data
        );

      }
    );
          /*
      =========================
      SECTION UPDATED
      =========================
      */

    socket.on(
      'section_updated',
      (data) => {

        socket.broadcast.emit(
          'section_updated',
          data
        );

      }
    );

    /*
    =========================
    DISCONNECT
    =========================
    */

    socket.on(
      'disconnect',
      () => {

        console.log(
          '❌ User disconnected:',
          socket.id
        );

        // Clean up from all brainstorm rooms
        brainstormRooms.forEach((users, roomName) => {
          const remainingUsers = [...users];

          remainingUsers.forEach(user => {
            if (user.socketId === socket.id) {
              users.delete(user);

              socket.to(roomName).emit(
                'user_left_brainstorm',
                { socketId: socket.id }
              );
            }
          });
        });

      }
    );

  }
);

server.listen(
  PORT,
  '0.0.0.0',
  () => {

    console.log(
      `✅ Backend running on port ${PORT}`
    );

  }
);