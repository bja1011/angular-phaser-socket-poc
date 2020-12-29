import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', (socket) => {
      // socket.join('room1')
      console.log('client connection', socket);
      this.socket.emit('event', { a: 123 });
    });

    this.socket.on('startGame', (socket) => {
      console.log('startGame');
    });
  }

  sendMessage(msg: string) {
    // this.socket.emit('message', msg);
  }

  getMessage() {}
}
