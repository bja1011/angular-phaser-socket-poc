import { TRASH_CONTAINERS_GAME_TYPES } from '../config/minigame-config';

export default class TrashContainer extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, type, frame) {
    super(scene, x, y, texture, frame);

    this.x = x;
    this.y = y;
    // this.texture = texture;
    this.scene = scene;
    this.type = type;

    this.setOrigin(0.5, 0);
    this.setDataEnabled();
    this.setDepth(3);

    switch (type) {
      case TRASH_CONTAINERS_GAME_TYPES.STANDARD:
        this.setDisplaySize(57, 100);
        break;

      case TRASH_CONTAINERS_GAME_TYPES.GIFT:
        break;

      case TRASH_CONTAINERS_GAME_TYPES.DOLPHIN:
        this.setDisplaySize(183, 66);
        break;
    }

    this.scene.add.existing(this);
  }

  animateContainerCollision() {
    this.scene.add.tween({
      targets: this,
      duration: 200,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      y: this.y - 7,
      yoyo: true,
      repeat: 0,
    });
  }

}
