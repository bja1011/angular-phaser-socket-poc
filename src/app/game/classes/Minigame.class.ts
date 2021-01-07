import { BehaviorSubject } from 'rxjs';
import { Socket } from 'socket.io-client';

export default class Minigame extends Phaser.Game {
  isGameLoaded = new BehaviorSubject(false);
  isSpectator: boolean;
  socket: Socket;
  gamePosition: number;

  constructor(gameConfig: Phaser.Types.Core.GameConfig | any) {
    super(gameConfig);

    this.isSpectator = gameConfig.isSpectator || false;
    this.socket = gameConfig.socket;
    this.gamePosition = gameConfig.gamePosition;
  }
}

