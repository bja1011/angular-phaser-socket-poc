import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  OnInit,
  EventEmitter,
} from '@angular/core';
import { SpectatorService } from '../services/spectator.service';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { PlayerService } from '../../player/services/player.service';
import { ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs';
import { ConnectionStatus } from '../../player/interfaces/connection.interface';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-spectator',
  templateUrl: './spectator.component.html',
  styleUrls: ['./spectator.component.scss'],
})
export class SpectatorComponent implements OnInit {
  // connection$ = this.activatedRoute.paramMap.pipe(
  //   switchMap((params) => {
  //     return this.spectatorService.connect(params.get('gameId'), 'spectator');
  //   })
  // );
  socket: Socket;
  players: any[] = [];
  timeLeft: number;
  private countdown: number;
  playerStatus: any;
  gamePositions = [1, 2, 3, 4];

  constructor(
    private spectatorService: SpectatorService,
    private activatedRoute: ActivatedRoute
  ) {}

  setPlayers(players: any[]) {
    this.players = players;
  }

  ngOnInit(): void {
    (window as any).globalEmitter = new EventEmitter();
    this.activatedRoute.paramMap.subscribe((params) => {
      this.socket?.disconnect();
      this.socket = null;
      this.socket = io(
        `${environment.socketUrl}?room=${params.get('gameId')}&token=spectator`
      );

      (window as any).globalEmitter.emit('restart-game');
    });

    // this.activatedRoute.paramMap
    //   .pipe(
    //     switchMap((params) => {
    //       return this.spectatorService.connect(
    //         params.get('gameId'),
    //         'spectator'
    //       );
    //     })
    //   )
    //   .subscribe(() => {
    //     // fromEvent(this.spectatorService.socket, 'connect').subscribe(() => {
    //     //   this.spectatorService.socket.emit('load-players', null, console.log);
    //     //   const disconnect$ = fromEvent(
    //     //     this.spectatorService.socket,
    //     //     'disconnect'
    //     //   ).pipe(take(1));
    //     //   fromEvent(this.spectatorService.socket, 'player-connected').pipe(
    //     //     takeUntil(disconnect$)
    //     //   );
    //     // });
    //   });
  }

  resetGame() {}
  disconnected() {}
  gameFinished() {}
}
