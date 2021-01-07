import { AfterViewInit, Component, Input } from '@angular/core';
import Minigame from '../classes/Minigame.class';
import MinigamePreloadScene from '../scenes/Minigame.preload.scene';
import MinigameStartScene from '../scenes/Minigame.start.scene';
import NO_ZOOM = Phaser.Scale.NO_ZOOM;
import { Socket } from 'socket.io-client';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  @Input() gamePosition = 0;
  @Input() isSpectator: boolean;
  @Input() socket: Socket;

  private game: Minigame;

  constructor() {}

  ngAfterViewInit(): void {
    this.game = new Minigame({
      type: Phaser.AUTO,
      width: 820,
      height: 570,
      parent: `game-${this.gamePosition}`,
      backgroundColor: 0xbfcdd7,
      zoom: NO_ZOOM,
      scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
      },
      scene: [MinigamePreloadScene, MinigameStartScene],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      socket: this.socket,
      gamePosition: this.gamePosition,
      isSpectator: this.isSpectator,
    } as any);
  }
}