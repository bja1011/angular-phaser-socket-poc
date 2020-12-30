import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../services/player.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  connection$ = this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      return this.playerService.connect(
        params.get('gameId'),
        params.get('token')
      );
    })
  );

  constructor(
    private playerService: PlayerService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}
}
