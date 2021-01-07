import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerService } from '../services/player.service';
import { ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnDestroy {
  player: any;
  socket: Socket;
  private routeParamsSub: Subscription;

  constructor(
    private playerService: PlayerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.routeParamsSub = this.activatedRoute.paramMap.subscribe((params) => {
      this.socket?.disconnect();
      this.socket = io(
        `${environment.socketUrl}?room=${params.get(
          'gameId'
        )}&token=${params.get('token')}`
      );
    });
  }

  ngOnDestroy(): void {
    this.routeParamsSub?.unsubscribe();
  }
}
