import Minigame from '../classes/Minigame.class';
import {
  MINIGAME_ATLAS,
  MINIGAME_SETTINGS,
  SORTING_PLATFORMS,
  TRASH_CONTAINERS_DEFINITIONS,
} from '../config/minigame-config';

export default class MinigamePreloadScene extends Phaser.Scene {
  constructor() {
    super('minigamePreload');
  }

  preload() {
    this.load.atlas(
      MINIGAME_ATLAS,
      `assets/sorting/atlas/minigame-atlas.png`,
      `assets/sorting/atlas/minigame-atlas.json`
    );

    this.load.spritesheet('explosion', 'assets/sorting/sprites/bomb_sprite.png', {
      frameWidth: 175,
      frameHeight: 175,
    });

    this.load.spritesheet('splash', 'assets/sorting/sprites/water_sprite.png', {
      frameWidth: 294,
      frameHeight: 120,
    });

    this.load.spritesheet('crash', 'assets/sorting/sprites/crash_sprite.png', {
      frameWidth: 165,
      frameHeight: 158,
    });

    this.load.audio('bomb-sound', [`assets/sorting/sounds/bomb-sound.wav`]);

    this.load.audio('correct-sound', [`assets/sorting/sounds/correct-sound.wav`]);

    this.load.audio('wrong-sound', [`assets/sorting/sounds/wrong-sound.mp3`]);

    this.load.audio('tube-sound', [`assets/sorting/sounds/tube-sound.wav`]);

    this.load.audio('splash-sound', [`assets/sorting/sounds/splash-sound.wav`]);

    this.load.audio('countdown-sound', [`assets/sorting/sounds/countdown-sound.wav`]);

    this.load.audio('background-sound', [
      `assets/sorting/sounds/background-sound.mp3`,
    ]);
  }

  create() {
    this.scene.start('minigameStart');
  }
}
