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