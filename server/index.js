const path = require('path');
const http = require('http');
const express = require('express');

const socketIO = require('socket.io');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);


let io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

server.listen(port, () => {
  console.log(`Server up on port ${port}.`);
});

io.on('connection', (socket) => {
  console.log('New connection');
  socket.emit('join', 'room1');

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

  socket.on('move', (data) => {
    socket.emit('move', data);
    socket.broadcast.emit('move', data);
  });

  socket.on('start', (data) => {
    socket.broadcast.emit('start');
  });

});


