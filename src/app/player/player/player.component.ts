import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../services/player.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  // connection$ = this.activatedRoute.paramMap.pipe(
  //   switchMap((params) => {
  //     return this.playerService.connect(
  //       params.get('gameId'),
  //       params.get('token')
  //     );
  //   })
  // );
  timeLeft: number;
  player: any;
  socket: Socket;
  countdown: number;

  constructor(
    private playerService: PlayerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.socket?.disconnect();
      this.socket = io(
        `${environment.socketUrl}?room=${params.get(
          'gameId'
        )}&token=${params.get('token')}`
      );

      fromEvent(this.socket, 'connect').subscribe(() => {
        const disconnect$ = fromEvent(this.socket, 'disconnect').pipe(take(1));

        this.socket.emit('load-player-info', null, (player) => {
          this.player = player;
        });

        fromEvent(this.socket, 'player-connected').pipe(takeUntil(disconnect$));

        fromEvent(this.socket, 'time-left')
          .pipe(takeUntil(disconnect$))
          .subscribe((timeLeft: number) => {
            this.timeLeft = timeLeft;
          });

        fromEvent(this.socket, 'countdown')
          .pipe(takeUntil(disconnect$))
          .subscribe((countdown: number) => {
            this.countdown = countdown;
          });
      });
    });
  }

  ngOnInit(): void {}

  updatePlayerStatus($event: any) {
    this.socket.emit('player-status', $event, console.log);
  }
}
