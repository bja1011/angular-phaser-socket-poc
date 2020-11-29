export default class Trash extends Phaser.GameObjects.Image {

  rotationSpeed;
  rotationDirection;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.x = x;
    this.y = y;
    this.scene = scene;

    this.setOrigin(0.5, 0.5);
    this.setScale(0.5, 0.5);

    this.rotationSpeed = this.setRandomRotationSpeed();
    this.rotationDirection = this.setRandomRotationDirection();

    this.scene.add.existing(this);
  }

  animateFallingTrash(fallingSpeed) {
    this.y += fallingSpeed;
    if (this.rotationDirection === 'left') {
      this.rotation -= this.rotationSpeed;
    } else {
      this.rotation += this.rotationSpeed;
    }
    this.checkTrashOutOfCamera();
  }

  setRandomRotationDirection() {
    const randomValue = Math.random();
    if ( randomValue > 0.5 ) {
      return 'left';
    } else {
      return 'right';
    }
  }

  setRandomRotationSpeed() {
    const min = 0.001;
    const max = 0.04;
    const randomValue = Math.random() * (max - min) + min;
    return randomValue;
  }

  checkTrashOutOfCamera() {
    if (this.y > this.scene.cameras.main.height - 20) {
      return true;
    }
  }

  trashDestroy() {
    this.destroy();
  }

}


