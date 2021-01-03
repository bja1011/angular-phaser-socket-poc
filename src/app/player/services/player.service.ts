import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subscription } from 'rxjs';
import { ConnectionStatus } from '../interfaces/connection.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private socket: Socket;
  private gameEventsSub: Subscription;

  constructor() {}

  connect(room: string, token?: string) {
    return new Observable<ConnectionStatus>((subscriber) => {
      subscriber.next(ConnectionStatus.CONNECTING);

      let tokenString = '';

      if (token) {
        tokenString = `&token=${token}`;
      }
      this.socket = io(`${environment.socketUrl}?room=${room}${tokenString}`);

      this.socket.on('connect', (socket) => {
        subscriber.next(ConnectionStatus.CONNECTED);

        this.gameEventsSub = this.listenGameEvents().subscribe(console.log);
      });

      this.socket.on('connect_error', (socket) => {
        subscriber.next(ConnectionStatus.ERROR);
        this.stopListeningGameEvents();
      });
    });
  }

  listenGameEvents() {
    return new Observable((subscriber) => {
      this.socket.on('countdown', (socket) => {
        subscriber.next('countdown');
      });
      this.socket.on('time-left', (socket) => {
        console.log(socket);
        subscriber.next('time-left');
      });
    });
  }

  emitEvent(event) {
    this.socket.emit(event);
  }

  stopListeningGameEvents() {
    this.gameEventsSub?.unsubscribe();
  }
}
