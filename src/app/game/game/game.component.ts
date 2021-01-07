import { AfterViewInit, Component, HostBinding, Input } from '@angular/core';
import Minigame from '../classes/Minigame.class';
import MinigamePreloadScene from '../scenes/Minigame.preload.scene';
import MinigameStartScene from '../scenes/Minigame.start.scene';
import NO_ZOOM = Phaser.Scale.NO_ZOOM;
import { Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  @Input() gamePosition = 0;
  @HostBinding('class.isPlayer') isPlayer;
  @Input() isSpectator: boolean;
  @Input() socket: Socket;

  private game: Minigame;
  player$: BehaviorSubject<any>;

  constructor() {}

  ngAfterViewInit(): void {
    this.isPlayer = !this.isSpectator;

    (window as any)?.globalEmitter
      ?.pipe(filter((value) => value === 'restart-game'))
      .subscribe(() => {
        this.game.destroy(true);
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

        this.player$ = this.game.player$;
      });

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

    this.player$ = this.game.player$;
  }
}
