import { MINIGAME_SETTINGS } from '../config/minigame-config';

export default class Tube extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.x = x;
    this.y = y;
    this.scene = scene;
    this.setOrigin(0.5, 0);
    this.setDepth(3);
    this.displayWidth = 95;
    this.displayHeight = 64;
    this.scene.add.existing(this);
  }


  isAnimationFinished = false;

  moveTube() {
    this.isAnimationFinished = false;
    const newPosition = this.generateRandomPosition();
    this.scene.add.tween({
      targets: this,
      duration: MINIGAME_SETTINGS.tubeMovingSpeed,
      x: newPosition,
      delay: MINIGAME_SETTINGS.tubeDelayTime,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      onComplete: () => {
        this.animateTube();
      }
    });
  }

  animateTube() {
    if (this.scene['allowSoundEffects']) {
      this.scene['tubeSound'].play();
    }

    this.scene.add.tween({
      targets: this,
      duration: 200,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      y: this.y + 15,
      yoyo: true,
      repeat: 0,
      onComplete: () => {
        this.isAnimationFinished = true;
      }
    });
  }

  generateRandomPosition() {
    const min = 0 + this.width / 2;
    const max = this.scene.cameras.main.width - this.width / 2;
    let randomValue;
    const currentValue = this.x;
    do {
      randomValue = Math.floor(Math.random() * (max - min)) + min;
    } while ( Math.abs(currentValue - randomValue) < 25);
    return randomValue;
  }
}
