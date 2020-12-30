import { Component, OnInit } from '@angular/core';
import { isSpectator } from '../../utils/utils';

@Component({
  selector: 'app-test-game',
  templateUrl: './test-game.component.html',
  styleUrls: ['./test-game.component.scss'],
})
export class TestGameComponent implements OnInit {
  title = 'sc-final-poc';
  top = 0;
  left = 0;
  private game: Phaser.Game;

  ngOnInit() {
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
  //   createGame() {
  //     const config = {
  //       type: Phaser.AUTO,
  //       parent: 'game',
  //       width: innerWidth,
  //       height: innerHeight,
  //       scale: {
  //         mode: Phaser.Scale.RESIZE,
  //         autoCenter: Phaser.Scale.CENTER_BOTH,
  //       },
  //       scene: MainScene,
  //     };
  //     this.game = new Phaser.Game(config);
  //     this.game['socketService'] = this.socketService;
  //   }
  // }
  //
  // class MainScene extends Phaser.Scene {
  //   private trashes: Phaser.GameObjects.Image[] = [];
  //   private currentTrash: Phaser.GameObjects.Image;
  //   private socketService: SocketService;
  //   private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  //
  //   init() {
  //     this.socketService = this.game['socketService'];
  //     this.cursors = this.input.keyboard.createCursorKeys();
  //   }
  //
  //   preload() {
  //     this.load.image('tc', 'assets/tc.png');
  //     this.load.image('apple', 'assets/apple.png');
  //   }
  //
  //   create() {
  //     const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xfff000, 0x000fff];
  //     for (let i = 0; i < 5; i++) {
  //       const tc = this.add.image(100 * i + 100, innerHeight - 400, 'tc');
  //       tc.setTint(colors[i]);
  //       this.trashes.push(tc);
  //       tc.setOrigin(0, 0);
  //     }
  //
  //     if (isSpectator) {
  //       this.socketService.socket.on('move', (data) => {
  //         if (this.currentTrash) {
  //           this.currentTrash.x = data.x;
  //           this.currentTrash.y = data.y;
  //         }
  //       });
  //     }
  //
  //     if (!isSpectator) {
  //       const text = this.add.text(innerWidth / 2, 200, 'Wystartuj grę');
  //       text.setOrigin(0.5, 1);
  //       text.setInteractive();
  //       text.on('pointerdown', () => {
  //         this.startGame(text);
  //       });
  //     } else {
  //       const text = this.add.text(
  //         innerWidth / 2,
  //         200,
  //         'Czekam na rozpoczęcie gry'
  //       );
  //       text.setOrigin(0.5, 1);
  //       text.setOrigin(0.5, 1);
  //       this.socketService.socket.on('start', (data) => {
  //         this.startGame(text);
  //       });
  //     }
  //   }
  //
  //   fireTrash() {
  //     if (this.currentTrash) {
  //       this.currentTrash.destroy();
  //       this.currentTrash = null;
  //     }
  //     this.currentTrash = this.add.image(200, -40, 'apple');
  //     this.currentTrash.setOrigin(0.5);
  //   }
  //
  //   fireTrashAnim(trash) {
  //     this.add.tween({
  //       targets: trash,
  //       duration: 300,
  //       y: trash.y - 50,
  //       yoyo: true,
  //       ease: Phaser.Math.Easing.Quadratic.InOut,
  //     });
  //   }
  //
  //   update(time, delta) {
  //     if (this.currentTrash) {
  //       this.currentTrash.y++;
  //
  //       if (!isSpectator()) {
  //         if (this.cursors.left.isDown) {
  //           this.currentTrash.x--;
  //           this.socketService.socket.emit('move', {
  //             x: this.currentTrash.x,
  //             y: this.currentTrash.y,
  //           });
  //         } else if (this.cursors.right.isDown) {
  //           this.currentTrash.x++;
  //           this.socketService.socket.emit('move', {
  //             x: this.currentTrash.x,
  //             y: this.currentTrash.y,
  //           });
  //         }
  //         if (this.cursors.down.isDown) {
  //           this.currentTrash.y += 5;
  //           this.socketService.socket.emit('move', {
  //             x: this.currentTrash.x,
  //             y: this.currentTrash.y,
  //           });
  //         }
  //       }
  //
  //       if (this.currentTrash.y > this.trashes[0].y) {
  //         this.trashes.forEach((trash) => {
  //           if (
  //             this.currentTrash.x > trash.x &&
  //             this.currentTrash.x < trash.x + trash.width
  //           ) {
  //             this.fireTrashAnim(trash);
  //             this.fireTrash();
  //           }
  //         });
  //       }
  //
  //       if (this.currentTrash.y > innerHeight) {
  //         this.fireTrash();
  //       }
  //     }
  //   }
  //
  //   private startGame(text: Phaser.GameObjects.Text) {
  //     if (!isSpectator()) {
  //       this.socketService.socket.emit('start');
  //     }
  //     text.destroy();
  //     this.fireTrash();
  //   }
}
