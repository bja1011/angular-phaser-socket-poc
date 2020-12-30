import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ConnectionStatus } from '../interfaces/connection.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private socket: Socket;

  constructor() {}

  connect(room: string, token: string) {
    return new Observable<ConnectionStatus>((subscriber) => {
      subscriber.next(ConnectionStatus.CONNECTING);

      this.socket = io(`${environment.socketUrl}?room=${room}&token=${token}`);

      this.socket.on('connect', (socket) => {
        subscriber.next(ConnectionStatus.CONNECTED);
      });

      this.socket.on('connect_error', (socket) => {
        subscriber.next(ConnectionStatus.ERROR);
      });

      this.socket.on('startGame', (socket) => {
        console.log('startGame');
      });
    });
  }

  joinGame() {

  }
}
