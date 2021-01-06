import {
  AfterViewInit,
  EventEmitter,
  Component,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Socket } from 'socket.io-client';
import { fromEvent } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-test-game',
  templateUrl: './test-game.component.html',
  styleUrls: ['./test-game.component.scss'],
})
export class TestGameComponent implements OnInit, AfterViewInit {
  title = 'sc-final-poc';
  top = 0;
  left = 0;
  private game: Phaser.Game;
  @Input() countdown: number;
  @Input() timeLeft: number;
  @Input() player: any;
  @Input() isSpectator: boolean;
  @Input() gamePosition = 0;
  @Input() socket;
  @Output() playerStatusChange = new EventEmitter<any>();

  playerStatusPassed: any;
  @Input()
  set playerStatus(playerStatusData) {
    this.playerStatusPassed = playerStatusData;
  }

  ngAfterViewInit() {
    this.createGame();
  }

  ngOnInit() {}

  createGame() {
    const config = {
      type: Phaser.AUTO,
      parent: `game-${this.gamePosition}`,
      width: 820,
      height: 570,
      scale: {
        mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: MainScene,
      isSpectator: this.isSpectator,
      socket: this.socket,
    };
    this.game = new MyGame(config);
    // this.game['socketService'] = this.socketService;
  }
}

class MyGame extends Phaser.Game {
  isSpectator: boolean;
  socket: Socket;
  constructor(config) {
    super(config);
    console.log(config);
    this.isSpectator = config.isSpectator;
    this.socket = config.socket;
  }
}

class MainScene extends Phaser.Scene {
  private trashes: Phaser.GameObjects.Image[] = [];
  private currentTrash: Phaser.GameObjects.Image;
  // private socketService: SocketService;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private isSpectator;
  private socket: Socket;
  gameStarted = false;

  init() {
    // this.socketService = this.game['socketService'];
    this.isSpectator = (this.game as MyGame).isSpectator;
    this.socket = (this.game as MyGame).socket;
    this.cursors = this.input.keyboard.createCursorKeys();

    if (this.isSpectator) {
      this.connectSpectatorSocket();
    } else {
      this.connectPlayerSocket();
    }
  }

  preload() {
    this.load.image('tc', 'assets/tc.png');
    this.load.image('apple', 'assets/apple.png');
  }

  create() {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xfff000, 0x000fff];
    for (let i = 0; i < 5; i++) {
      const tc = this.add.image(
        100 * i + 100,
        this.cameras.main.height - 100,
        'tc'
      );
      tc.setTint(colors[i]);
      this.trashes.push(tc);
      tc.setOrigin(0, 0);
    }

    // if (isSpectator) {
    //   this.socketService.socket.on('move', (data) => {
    //     if (this.currentTrash) {
    //       this.currentTrash.x = data.x;
    //       this.currentTrash.y = data.y;
    //     }
    //   });
    // }

    if (!this.isSpectator) {
      const text = this.add.text(
        this.cameras.main.width / 2,
        200,
        'Wystartuj grę'
      );
      text.setOrigin(0.5, 1);
      text.setInteractive();
      text.on('pointerdown', () => {
        this.startGame(text);
      });
    } else {
      const text = this.add.text(
        innerWidth / 2,
        200,
        'Czekam na rozpoczęcie gry'
      );
      text.setOrigin(0.5, 1);
      text.setOrigin(0.5, 1);
      // this.socketService.socket.on('start', (data) => {
      //   this.startGame(text);
      // });
    }
  }

  fireTrash() {
    if (this.currentTrash) {
      this.currentTrash.destroy();
      this.currentTrash = null;
    }
    this.currentTrash = this.add.image(200, -40, 'apple');
    this.currentTrash.setOrigin(0.5);
  }

  fireTrashAnim(trash) {
    this.add.tween({
      targets: trash,
      duration: 300,
      y: trash.y - 50,
      yoyo: true,
      ease: Phaser.Math.Easing.Quadratic.InOut,
    });
  }

  update(time, delta) {
    if (this.currentTrash) {
      this.currentTrash.y++;

      if (!this.isSpectator) {
        if (this.cursors.left.isDown) {
          this.currentTrash.x--;
          // this.socketService.socket.emit('move', {
          //   x: this.currentTrash.x,
          //   y: this.currentTrash.y,
          // });
        } else if (this.cursors.right.isDown) {
          this.currentTrash.x++;
          // this.socketService.socket.emit('move', {
          //   x: this.currentTrash.x,
          //   y: this.currentTrash.y,
          // });
        }
        if (this.cursors.down.isDown) {
          this.currentTrash.y += 5;
          // this.socketService.socket.emit('move', {
          //   x: this.currentTrash.x,
          //   y: this.currentTrash.y,
          // });
        }

        this.emitPlayerStatus();
      }

      if (this.currentTrash.y > this.trashes[0].y) {
        this.trashes.forEach((trash) => {
          if (
            this.currentTrash.x > trash.x &&
            this.currentTrash.x < trash.x + trash.width
          ) {
            this.fireTrashAnim(trash);
            this.fireTrash();
          }
        });
      }

      if (this.currentTrash.y > innerHeight) {
        this.fireTrash();
      }
    }
  }

  private startGame(text: Phaser.GameObjects.Text) {
    this.gameStarted = true;
    if (!this.isSpectator) {
      // this.socketService.socket.emit('start');
    }
    text?.destroy();
    this.fireTrash();
  }

  connectPlayerSocket() {
    this.socket.on('connect', console.log);
    fromEvent(this.socket, 'connect').subscribe(() => {
      console.log('connect');
      const disconnect$ = fromEvent(this.socket, 'disconnect').pipe(take(1));

      this.socket.emit('load-player-info', null, (player) => {
        // this.player = player;
      });

      fromEvent(this.socket, 'player-connected').pipe(takeUntil(disconnect$));

      fromEvent(this.socket, 'time-left')
        .pipe(takeUntil(disconnect$))
        .subscribe((timeLeft: number) => {
          console.log(timeLeft);
          // this.timeLeft = timeLeft;
        });

      fromEvent(this.socket, 'countdown')
        .pipe(takeUntil(disconnect$))
        .subscribe((countdown: number) => {
          console.log(countdown);

          if (countdown === 0) {
            this.startGame(null);
          }
        });
    });
  }

  connectSpectatorSocket() {
    fromEvent(this.socket, 'connect').subscribe(() => {
      const disconnect$ = fromEvent(this.socket, 'disconnect').pipe(take(1));

      this.socket.emit('load-players', null, (players) => {
        // this.players = players;
      });

      fromEvent(this.socket, 'player-connected').pipe(takeUntil(disconnect$));

      fromEvent(this.socket, 'time-left')
        .pipe(takeUntil(disconnect$))
        .subscribe((timeLeft: number) => {
          // this.timeLeft = timeLeft;
        });

      fromEvent(this.socket, 'countdown')
        .pipe(takeUntil(disconnect$))
        .subscribe((countdown: number) => {
          if (countdown === 0) {
            this.startGame(null);
          }
        });

      fromEvent(this.socket, 'player-status')
        .pipe(takeUntil(disconnect$))
        .subscribe((playerStatus: any) => {
          if (!this.gameStarted) {
            this.startGame(null);
          }
          if (!this.currentTrash) {
            this.fireTrash();
          }
          this.currentTrash.x = playerStatus.status.x;
          this.currentTrash.y = playerStatus.status.y;
        });
    });
  }

  private emitPlayerStatus() {
    if (!this.isSpectator) {
      this.socket.emit('player-status', this.currentTrash, console.log);
    }
  }
}
