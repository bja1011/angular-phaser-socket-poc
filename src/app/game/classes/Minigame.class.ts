import { BehaviorSubject } from 'rxjs';

export default class Minigame extends Phaser.Game {
  isGameLoaded = new BehaviorSubject(false);

  constructor(gameConfig: Phaser.Types.Core.GameConfig) {
    super(gameConfig);
  }
}
