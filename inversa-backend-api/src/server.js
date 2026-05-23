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
    },

  });

io.on(
  'connection',
  (socket) => {

    console.log(
      '⚡ User connected:',
      socket.id
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
BRAINSTORM UPDATE
=========================
*/

    socket.on(
      'brainstorm_update',
      ({ projectId }) => {

        socket.broadcast.emit(
          'brainstorm_updated',
          { projectId }
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