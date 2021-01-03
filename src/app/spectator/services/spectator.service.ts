import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ConnectionStatus } from '../../player/interfaces/connection.interface';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SpectatorService {
  socket: Socket;
  private gameEventsSub: Subscription;

  constructor() {}

  connect(room: string, token: string) {
    return new Observable<ConnectionStatus>((subscriber) => {
      subscriber.next(ConnectionStatus.CONNECTING);

      this.socket = io(`${environment.socketUrl}?room=${room}&token=${token}`);
      //
      // this.socket.on('connect', () => {
      //   this.socket.emit('load-players', null);
      // });

      // fromEvent(this.socket, 'connect').subscribe(() => {
      //   subscriber.next(ConnectionStatus.CONNECTED);
      //   this.socket.emit('load-players', null, console.log);
      //   const disconnect$ = fromEvent(this.socket, 'disconnect').pipe(take(1));
      //   const message$ = this.listenForEvent('player-connected', disconnect$);
      // });

      // this.socket.on('connect', (socket) => {
      //   subscriber.next(ConnectionStatus.CONNECTED);
      //
      //   this.gameEventsSub = this.listenGameEvents().subscribe(console.log);
      // });
      //
      // this.socket.on('connect_error', (socket) => {
      //   subscriber.next(ConnectionStatus.ERROR);
      //   // this.stopListeningGameEvents();
      // });
      //
      // this.socket.on('player-disconnected', (socket) => {
      //   console.log(socket);
      // });
      //
      // this.socket.on('player-connected', (socket) => {
      //   console.log(socket);
      //   // subscriber.next(ConnectionStatus.ERROR);
      //   // this.stopListeningGameEvents();
      // });
    });
  }

  listen() {}

  listenForEvent(eventName: string, disconnectEvent$: Observable<any>) {
    return fromEvent(this.socket, 'player-connected').pipe(
      takeUntil(disconnectEvent$)
    );
  }

  // listenGameEvents() {
  //   return new Observable((subscriber) => {
  //     this.socket.on('countdown', (socket) => {
  //       subscriber.next('countdown');
  //     });
  //     this.socket.on('time-left', (socket) => {
  //       console.log(socket);
  //       subscriber.next('time-left');
  //     });
  //   });
  // }

  // stopListeningGameEvents() {
  //   this.gameEventsSub?.unsubscribe();
  // }

  emitEvent(event) {
    this.socket.emit(event);
  }
}
