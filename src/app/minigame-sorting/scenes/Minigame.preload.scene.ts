import { GameService } from '../../game/services/game.service';
import Minigame from '../classes/Minigame.class';
import { MINIGAME_ATLAS, MINIGAME_SETTINGS, SORTING_PLATFORMS, TRASH_CONTAINERS_DEFINITIONS } from '../config/minigame-config';

export default class MinigamePreloadScene extends Phaser.Scene {

  gameService: GameService;

  constructor() {
    super('minigamePreload');
  }

  preload() {
    this.gameService = (this.game as Minigame).gameService;

    this.load.atlas(
      MINIGAME_ATLAS,
      this.gameService.assetsService.getAssetPath(`sorting/atlas/minigame-atlas.png`),
      this.gameService.assetsService.getAssetPath(`sorting/atlas/minigame-atlas.json`),
    );

    this.load.spritesheet('explosion',
      this.gameService.assetsService.getAssetPath('sorting/sprites/bomb_sprite.png'), {
        frameWidth: 175,
        frameHeight: 175
      });

    this.load.spritesheet('splash',
      this.gameService.assetsService.getAssetPath('sorting/sprites/water_sprite.png'), {
        frameWidth: 294,
        frameHeight: 120
      });

    this.load.spritesheet('crash',
      this.gameService.assetsService.getAssetPath('sorting/sprites/crash_sprite.png'), {
        frameWidth: 165,
        frameHeight: 158
      });

    this.load.audio('bomb-sound', [
      this.gameService.assetsService.getAssetPath(`sorting/sounds/bomb-sound.wav`),
    ]);

    this.load.audio('correct-sound', [
      this.gameService.assetsService.getAssetPath(`sorting/sounds/correct-sound.wav`),
    ]);

    this.load.audio('wrong-sound', [
      this.gameService.assetsService.getAssetPath(`sorting/sounds/wrong-sound.mp3`),
    ]);

    this.load.audio('tube-sound', [
      this.gameService.assetsService.getAssetPath(`sorting/sounds/tube-sound.wav`),
    ]);

    this.load.audio('splash-sound', [
      this.gameService.assetsService.getAssetPath(`sorting/sounds/splash-sound.wav`),
    ]);

    this.load.audio('countdown-sound', [
      this.gameService.assetsService.getAssetPath(`sorting/sounds/countdown-sound.wav`),
    ]);

    this.load.audio('background-sound', [
      this.gameService.assetsService.getAssetPath(`sorting/sounds/background-sound.mp3`),
    ]);
  }

  create() {
    this.scene.start('minigameStart');
  }


}
