import { BehaviorSubject } from 'rxjs';
import { Socket } from 'socket.io-client';
import { EventEmitter } from '@angular/core';

export default class Minigame extends Phaser.Game {
  isGameLoaded = new BehaviorSubject(false);
  isSpectator: boolean;
  socket: Socket;
  gamePosition: number;
  player$: BehaviorSubject<any>;
  socketEventEmitter: EventEmitter<any>;

  constructor(gameConfig: Phaser.Types.Core.GameConfig | any) {
    super(gameConfig);

    this.isSpectator = gameConfig.isSpectator || false;
    this.socket = gameConfig.socket;
    this.gamePosition = gameConfig.gamePosition;
    this.socketEventEmitter = gameConfig.socketEventEmitter;

    this.player$ = new BehaviorSubject<any>(null);
  }
}
