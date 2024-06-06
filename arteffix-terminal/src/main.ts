/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import { createServer } from 'http';
import * as path from 'path';
import { Server } from 'socket.io';
import { Terminal } from './terminal';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to arteffix-terminal!' });
});

const port = process.env.PORT || 3333;

io.on('connection', (socket) => {
  const ptyProcess = new Terminal();
  socket.on('cmd', (msg) => {
    ptyProcess.write(msg);
  });

  ptyProcess.onData((res: string) => {
    socket.emit('cmd-res', res);
  });
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
