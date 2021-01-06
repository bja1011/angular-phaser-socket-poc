import {
  AfterViewInit,
  EventEmitter,
  Component,
  Input,
  OnInit,
  Output,
} from '@angular/core';

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

  ngOnInit() {
    // console.log(this.gamePosition);
    // console.log(`#game-${this.gamePosition}`);
    // let s = `#game-${this.gamePosition}`;
    // console.log(document.querySelector(s));
    // console.log(document.querySelector(`#game-0`));
    // this.createGame();
  }

  //   constructor(private socketService: SocketService) {
  //     // socketService.socket.on('move', (data) => {
  //     //   // console.log(data);
  //     //   this.top = data.y;
  //     //   this.left = data.x;
  //     // });
  //
  //     if (!location.search.includes('spectator')) {
  //       // addEventListener('mousemove', (event) => {
  //       //   socketService.socket.emit('move', { x: event.clientX, y: event.clientY });
  //       // });
  //     }
  //   }
  //
  //   move($event: KeyboardEvent) {
  //     console.log($event);
  //   }
  //
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
      playerStatusChangeEmitter: this.playerStatusChange,
    };
    this.game = new MyGame(config);
    // this.game['socketService'] = this.socketService;
  }
}

class MyGame extends Phaser.Game {
  isSpectator: boolean;
  playerStatusChangeEmitter: EventEmitter<any>;
  constructor(config) {
    super(config);
    console.log(config);
    this.isSpectator = config.isSpectator;
    this.playerStatusChangeEmitter = config.playerStatusChangeEmitter;
  }
}

class MainScene extends Phaser.Scene {
  private trashes: Phaser.GameObjects.Image[] = [];
  private currentTrash: Phaser.GameObjects.Image;
  // private socketService: SocketService;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private isSpectator;
  private playerStatusChangeEmitter: EventEmitter<any>;

  init() {
    // this.socketService = this.game['socketService'];
    this.isSpectator = (this.game as MyGame).isSpectator;
    this.playerStatusChangeEmitter = (this
      .game as MyGame).playerStatusChangeEmitter;
    this.cursors = this.input.keyboard.createCursorKeys();
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
        this.playerStatusChangeEmitter.emit(this.currentTrash);
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
    if (!this.isSpectator) {
      // this.socketService.socket.emit('start');
    }
    text.destroy();
    this.fireTrash();
  }
}
