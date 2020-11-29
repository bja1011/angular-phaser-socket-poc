import { GameService } from '../../game/services/game.service';
import {
  BOMB_DEFINITION,
  DOLPHIN_DEFINITION,
  DOLPHIN_PKT,
  DOLPHIN_SETTINGS,
  GIFT_DEFINITION,
  GIFT_PKT,
  MINIGAME_ATLAS,
  MINIGAME_COUNTDOWN_STYLES,
  MINIGAME_EVENTS,
  MINIGAME_SETTINGS,
  MINIGAME_TEXT_STYLES,
  MINIGAME_VERSION_DOLPHIN,
  MINIGAME_VERSION_GIFT,
  MINIGAME_VERSION_STANDARD,
  MinigameState,
  SORTING_PLATFORMS,
  TRASH_CONTAINERS_DEFINITIONS,
  TRASH_CONTAINERS_GAME_TYPES,
  TRASH_TYPE,
} from '../config/minigame-config';
import Tube from '../classes/Tube.class';
import TrashContainer from '../classes/TrashContainer.class';
import Trash from '../classes/Trash.class';
import { Subject } from 'rxjs';

export default class MinigameStartScene extends Phaser.Scene {

  gameService: GameService;
  SETTINGS;
  public bg: Phaser.GameObjects.Sprite;
  platforms: Phaser.GameObjects.Image[] = [];
  tube: Tube;
  isGameStarted = false;
  scoreText: Phaser.GameObjects.Text;
  timeText: Phaser.GameObjects.Text;
  countdownText: Phaser.GameObjects.Text;
  timeLeft: number;
  timeInit: number;
  countdownInitNumber: number;
  timeTimerEvent: Phaser.Time.TimerEvent;
  timeCountdownEvent: Phaser.Time.TimerEvent;
  score = 0;
  totalScore = 0;
  playerLivesNumber: number;
  playerLivesArray: Phaser.GameObjects.Image[] = [];
  trashContainersArray: TrashContainer[] = [];
  trashElement: Trash;
  isTrashAvailable = false;
  keyLeft: Phaser.Input.Keyboard.Key;
  keyRight: Phaser.Input.Keyboard.Key;
  keyDown: Phaser.Input.Keyboard.Key;
  keyUp: Phaser.Input.Keyboard.Key;
  spacebar: Phaser.Input.Keyboard.Key;
  countdownForeground;
  clickMoveDirection = null;
  trashElementType: string;
  fallingSpeed: number;
  gameVersionNumber: number;

  playerDolphinsArray: Phaser.GameObjects.Image[] = [];
  playerDolphinsCatched = 0;
  playerDolphinsCreated = 0;
  dolphinOrder: number;
  dolphinGameBombsCreated = 0;
  isBombLastTrash = false;

  standardGameTrashesInRow: number;
  standardGameBombOrder: number;
  standardGameGeneratedTrashes = 0;
  standardTrashesCatched = 0;

  allowSoundEffects = true;
  bombSound: Phaser.Sound.BaseSound;
  crashSound: Phaser.Sound.BaseSound;
  splashSound: Phaser.Sound.BaseSound;
  correctSound: Phaser.Sound.BaseSound;
  wrongSound: Phaser.Sound.BaseSound;
  public tubeSound: Phaser.Sound.BaseSound;
  backgroundMusicSound: Phaser.Sound.BaseSound;
  countdownSound: Phaser.Sound.BaseSound;
  countdownSoundInterval;
  countdownSoundNumber = 3;

  isFeaturePauseEnabled = false;
  isPauseEnabled = false;

  hudScores = new Subject();
  gameStateSubject: Subject<MinigameState> = new Subject();
  messageSubject: Subject<{ action: string, value?: any }> = new Subject();

  trashesOrderArray = [];
  trashesId = [];
  minimumTrashesAmount = 12;
  currentTrashIndex = 0;

  giftCatched = 0;
  giftIcon: Phaser.GameObjects.Sprite;

  constructor() {
    super('minigameStart');
    this.SETTINGS = { ...MINIGAME_SETTINGS };
  }

  create() {
    this.setInitialParams();
    this.createBackground();
    this.createPlatforms();
    this.createTube();
    this.createScoreBoard();
    this.createTimeBoard();
    this.createStandardTrashContainers();
    this.keyboardKeysInit();
    this.animationExplode();
    this.animationSplash();
    this.animationCrush();
    if (this.allowSoundEffects) {
      this.createSoundEffects();
    }
    this.game['isGameLoaded'].next(true);
  }

  update() {
    if (this.isGameStarted) {
      this.movePlatforms();
      this.changeFallingSpeed();

      if (this.tube.isAnimationFinished) {
        if (this.trashElement) {
          this.keyboardKeysManager(this.trashElement);
          this.trashElement.animateFallingTrash(this.fallingSpeed);
          this.checkTrashCollision();
          if (this.trashElement && this.trashElement.checkTrashOutOfCamera()) {
            if (this.trashElement.getData(TRASH_TYPE) !== 'bomb') {
              this.trashCrash();
              this.livesSubtract();
              this.initNewTrash();
            } else {
              this.bombDestroy();
              this.setTotalScore();
              this.initNewTrash();
            }
          }
        } else {
          if (this.gameVersionNumber === MINIGAME_VERSION_STANDARD) {
            this.createStandardGameTrash2();
          } else if (this.gameVersionNumber === MINIGAME_VERSION_DOLPHIN) {
            this.createDolphinGameTrash2();
          } else if (this.gameVersionNumber === MINIGAME_VERSION_GIFT) {
            this.createGiftGameTrash();
          }
        }
      }
    }
  }

  generateStandardTrashesOrder(isGift?) {
    if (this.trashesId.length) {
      this.generateTrashesObjectsById();
      return;
    }
    const trashesOrderAmount = 50;
    this.generateRandomTrashesArray(trashesOrderAmount);
    const bombIndex = [];
    let index = 0;
    for (let i = 0; i < 7; i++) {
      index += Phaser.Math.Between(3, 5);
      bombIndex.push(index);
    }
    this.trashesOrderArray.forEach((element, objIndex) => {
      if (bombIndex.includes(objIndex)) {
        this.trashesOrderArray[objIndex] = BOMB_DEFINITION;
      }
    });
    if (isGift === MINIGAME_VERSION_GIFT) {
      this.giftReplacement(1, 4);
    }
    this.trashesId = this.trashesOrderArray.map((trash) => trash.id);
  }

  generateDolphinTrashesOrder(isGift?) {
    if (this.trashesId.length) {
      this.generateTrashesObjectsById();
      return;
    }
    const trashesOrderAmount = 50;
    this.generateRandomTrashesArray(trashesOrderAmount);
    for (let i = 1; i <= 3; i++) {
      this.dolphinReplacement();
    }
    if (isGift === MINIGAME_VERSION_GIFT) {
      this.giftReplacement(1, this.minimumTrashesAmount - 1);
    }
    this.bombReplacement(1, this.minimumTrashesAmount - 1);
    this.bombReplacement(16, 17);
    for (let i = 1; i <= 6; i++) {
      this.bombReplacement(this.minimumTrashesAmount + 5, trashesOrderAmount - 2);
    }
    this.trashesId = this.trashesOrderArray.map((trash) => trash.id);
  }

  generateRandomTrashesArray(trashesObjAmount: number) {
    let previousIndex;
    do {
      const trashIndex = Phaser.Math.Between(0, this.SETTINGS.trashesDefinitions.length - 1);
      if (trashIndex === previousIndex) {
        continue;
      }
      previousIndex = trashIndex;
      const randomTrash = this.SETTINGS.trashesDefinitions[trashIndex];
      this.trashesOrderArray.push(randomTrash);
    } while (this.trashesOrderArray.length < trashesObjAmount);
  }

  generateTrashesObjectsById() {
    this.trashesOrderArray = this.trashesId.map((id) => {
      if (id === 500) {
        return BOMB_DEFINITION;
      }
      if (id === 100) {
        return DOLPHIN_DEFINITION;
      }
      if (id === 200) {
        return GIFT_DEFINITION;
      }
      return this.SETTINGS.trashesDefinitions.find(trash => trash.id === id);
    });
  }

  dolphinReplacement() {
    const randomNumber = Phaser.Math.Between(1, this.minimumTrashesAmount - 1);
    const dolphin = DOLPHIN_DEFINITION;
    if (this.trashesOrderArray[randomNumber].type !== 'dolphin' && this.trashesOrderArray[randomNumber - 1].type !== 'dolphin' && this.trashesOrderArray[randomNumber + 1].type !== 'dolphin' && this.trashesOrderArray[randomNumber].type !== 'gift') {
      this.trashesOrderArray[randomNumber] = dolphin;
    } else {
      this.dolphinReplacement();
    }
  }

  bombReplacement(minIndex, maxIndex) {
    const randomNumber = Phaser.Math.Between(minIndex, maxIndex);
    const bomb = BOMB_DEFINITION;
    if (this.trashesOrderArray[randomNumber].type === 'dolphin' || this.trashesOrderArray[randomNumber + 1].type === 'bomb' || this.trashesOrderArray[randomNumber - 1].type === 'bomb' || this.trashesOrderArray[randomNumber].type === 'gift') {
      this.bombReplacement(minIndex, maxIndex);
    } else {
      this.trashesOrderArray[randomNumber] = bomb;
    }
  }

  giftReplacement(minIndex, maxIndex) {
    const randomNumber = Phaser.Math.Between(minIndex, maxIndex);
    const gift = GIFT_DEFINITION;
    if (this.trashesOrderArray[randomNumber].type !== 'dolphin' && this.trashesOrderArray[randomNumber - 1].type !== 'dolphin' && this.trashesOrderArray[randomNumber + 1].type !== 'dolphin' && this.trashesOrderArray[randomNumber].type !== 'bomb') {
      this.trashesOrderArray[randomNumber] = gift;
    } else {
      this.giftReplacement(minIndex, maxIndex);
    }
  }

  pauseManager() {
    this.input.keyboard.on('keyup-SPACE', () => {
      if (this.isFeaturePauseEnabled || this.isPauseEnabled) {
        this.resumeGame();
      } else {
        this.messageSubject.next({
          action: MINIGAME_EVENTS.FEATURE_PAUSE_ENABLED,
        });
        this.isFeaturePauseEnabled = true;
      }
    });
  }

  resumeGame = () => {
    if (this.isFeaturePauseEnabled || this.isPauseEnabled) {
      this.messageSubject.next({
        action: MINIGAME_EVENTS.PAUSE_DISABLED,
      });
      this.isFeaturePauseEnabled = false;
      this.isPauseEnabled = false;
      this.scene.resume('minigameStart');
      this.backgroundMusicSound['volume'] = 1;
      this.input.keyboard.resetKeys();
    }
  };

  createWithSettings(gameVersionNumber, minigameState?: MinigameState) {
    this.setInitialParams(minigameState);
    this.gameVersionNumber = gameVersionNumber;

    this.createLifeBoard();
    if (gameVersionNumber === MINIGAME_VERSION_STANDARD || gameVersionNumber === MINIGAME_VERSION_GIFT) {
      this.generateStandardTrashesOrder(gameVersionNumber);
    }
    if (gameVersionNumber === MINIGAME_VERSION_DOLPHIN) {
      this.createPoolContainer();
      this.createDolphinBoard();
      this.generateDolphinTrashesOrder(gameVersionNumber);
    }
    if (gameVersionNumber === MINIGAME_VERSION_GIFT) {
      this.createGiftContainer();
      this.createGiftBoard();
    }
    this.createCountdown();
  }

  createBackground() {
    this.bg = this.add.sprite(this.cameras.main.width / 2, 0, MINIGAME_ATLAS, 'sorting-background-desktop.png');
    this.bg.setOrigin(0.5, 0);
    const bgGround = this.add.sprite(0, this.cameras.main.height - 18, MINIGAME_ATLAS, 'sorting-ground-desktop.png');
    bgGround.setOrigin(0, 0);
    bgGround.setDepth(3);
  }

  createPlatforms() {
    SORTING_PLATFORMS.forEach((group) => {
      group.forEach((item) => {
        const platform = this.add.sprite(item.startX, item.startY, MINIGAME_ATLAS, item.image);
        platform.setOrigin(0, 0);
        platform.setDataEnabled();
        platform.setData('direction', item.direction);
        this.platforms.push(platform);
      });
    });
  }

  movePlatforms() {
    this.platforms.forEach((item) => {
      if (item.getData('direction') === 'left') {
        item.x -= this.SETTINGS.sortingPlatformsSpeed;
        if ((item.x + 776) < 0) {
          item.x = this.cameras.main.width;
        }
      }
      if (item.getData('direction') === 'right') {
        item.x += this.SETTINGS.sortingPlatformsSpeed;
        if (item.x > this.cameras.main.width) {
          item.x = -792;
        }
      }
    });
  }

  createTube() {
    this.tube = new Tube(this, this.cameras.main.width / 2, -15, MINIGAME_ATLAS, 'sorting-tube.png');
  }

  createScoreBoard() {
    const scoreboard = this.add.sprite(26, 20, MINIGAME_ATLAS, 'bar-1.png');
    scoreboard.setOrigin(0, 0);
    scoreboard.setDepth(4);
    scoreboard.setDisplaySize(88, 30);

    this.scoreText = this.add.text(102, 26, `${this.totalScore}`, MINIGAME_TEXT_STYLES);
    this.scoreText.setOrigin(1, 0);
    this.scoreText.setDepth(5);

    const ecoIcon = this.add.sprite(43, 35, MINIGAME_ATLAS, 'sorting-currency.png');
    ecoIcon.setDisplaySize(22, 22);
    ecoIcon.setDepth(5);
  }

  createTimeBoard() {
    const timeboard = this.add.sprite(696, 20, MINIGAME_ATLAS, 'bar-3.png');
    timeboard.setOrigin(0, 0);
    timeboard.setDisplaySize(65, 30);
    timeboard.setDepth(4);

    const clock = this.add.sprite(711, 35, MINIGAME_ATLAS, 'clock.png');
    clock.setDepth(5);

    this.timeText = this.add.text(749, 26, `${this.timeLeft}`, MINIGAME_TEXT_STYLES);
    this.timeText.setOrigin(1, 0);
    this.timeText.setDepth(5);
  }

  startTimer() {
    this.timeTimerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.timerLogic,
      callbackScope: this,
      loop: true,
    });
  }

  timerLogic() {
    this.timeLeft--;
    this.timeText.setText(`${this.timeLeft}`);
    if (this.timeLeft === 0) {
      this.gameOver();
    }
  }

  createLifeBoard() {
    const lifeboard = this.add.sprite(550, 20, MINIGAME_ATLAS, 'bar-2.png');
    lifeboard.setOrigin(0, 0);
    lifeboard.setDisplaySize(130, 30);
    lifeboard.setDepth(4);

    let lifeInitHorizontalValue = 563;
    for (let i = 1; i <= this.SETTINGS.maxLives; i++) {
      const life = this.add.sprite(lifeInitHorizontalValue, 27, MINIGAME_ATLAS, 'heart.png');
      life.setOrigin(0, 0);
      life.setDepth(5);
      this.playerLivesArray.push(life);
      lifeInitHorizontalValue += 22;
    }
    this.changeLifeBoardTextures();
  }

  createStandardTrashContainers() {
    const allContainersWidth = 57 * TRASH_CONTAINERS_DEFINITIONS.length;
    let gapWidth = (this.cameras.main.width - allContainersWidth) / 2 + 28.5;

    for (let i = 0; TRASH_CONTAINERS_DEFINITIONS[i]; i++) {
      const trashContainer = new TrashContainer(
        this,
        gapWidth,
        this.cameras.main.height - 117,
        MINIGAME_ATLAS,
        TRASH_CONTAINERS_GAME_TYPES.STANDARD,
        `sorting-bin-${TRASH_CONTAINERS_DEFINITIONS[i]}.png`);
      trashContainer.setData(TRASH_TYPE, TRASH_CONTAINERS_DEFINITIONS[i]);
      this.trashContainersArray.push(trashContainer);
      gapWidth += 57;
    }

  }

  createStandardGameTrash2() {
    const trashObject = this.trashesOrderArray[this.currentTrashIndex];
    if (trashObject.type === 'bomb') {
      this.generateBomb();
    } else {
      this.generateTrash(trashObject);
    }
    this.currentTrashIndex++;
  }

  createDolphinGameTrash2() {
    const trashObject = this.trashesOrderArray[this.currentTrashIndex];
    if (trashObject.type === 'dolphin') {
      const randomDolphin = Phaser.Math.Between(1, 2);
      if (randomDolphin === 1) {
        this.generateDolphin1();
      } else {
        this.generateDolphin2();
      }
      this.playerDolphinsCreated++;
    } else if (trashObject.type === 'bomb') {
      this.generateBomb();
    } else {
      this.generateTrash(trashObject);
    }
    this.currentTrashIndex++;
  }

  createGiftGameTrash() {
    const trashObject = this.trashesOrderArray[this.currentTrashIndex];
    if (trashObject.type === 'dolphin') {
      const randomDolphin = Phaser.Math.Between(1, 2);
      if (randomDolphin === 1) {
        this.generateDolphin1();
      } else {
        this.generateDolphin2();
      }
      this.playerDolphinsCreated++;
    } else if (trashObject.type === 'bomb') {
      this.generateBomb();
    } else if (trashObject.type === 'gift') {
      this.generateGift();
    } else {
      this.generateTrash(trashObject);
    }
    this.currentTrashIndex++;
  }

  generateDolphin1() {
    this.trashElement = new Trash(this, this.tube.x, 0, MINIGAME_ATLAS, `trash-dolphin-1.png`);
    this.trashElement.setDisplaySize(68, 100);
    this.trashElement.setDataEnabled();
    this.trashElement.setData(TRASH_TYPE, DOLPHIN_DEFINITION.type);
    this.trashElementType = DOLPHIN_DEFINITION.type;
  }

  generateDolphin2() {
    this.trashElement = new Trash(this, this.tube.x, 0, MINIGAME_ATLAS, `trash-dolphin-2.png`);
    this.trashElement.setDisplaySize(100, 53);
    this.trashElement.setDataEnabled();
    this.trashElement.setData(TRASH_TYPE, DOLPHIN_DEFINITION.type);
    this.trashElementType = DOLPHIN_DEFINITION.type;
  }

  generateBomb() {
    this.trashElement = new Trash(this, this.tube.x, 0, MINIGAME_ATLAS, `trash-bomb.png`);
    this.trashElement.setData(TRASH_TYPE, BOMB_DEFINITION.type);
    this.trashElementType = BOMB_DEFINITION.type;
  }

  generateGift() {
    this.trashElement = new Trash(this, this.tube.x, 0, MINIGAME_ATLAS, `trash-gift.png`);
    this.trashElement.setData(TRASH_TYPE, GIFT_DEFINITION.type);
    this.trashElementType = GIFT_DEFINITION.type;
  }

  generateTrash(obj) {
    this.trashElement = new Trash(this, this.tube.x, 0, MINIGAME_ATLAS, `${obj.name}.png`);
    this.trashElement.setDataEnabled();
    this.trashElement.setData(TRASH_TYPE, obj.type);
    this.trashElementType = obj.type;
  }

  keyboardKeysInit() {
    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  keyboardKeysManager(element) {
    if (element) {
      if (this.keyLeft.isDown) {
        if (element.x > 0) {
          element.x -= this.SETTINGS.trashMovingSpeed;
        }
      }
      if (this.keyRight.isDown) {
        if (element.x < this.cameras.main.width) {
          element.x += this.SETTINGS.trashMovingSpeed;
        }
      }
      if (this.keyDown.isDown) {
        element.y += (this.fallingSpeed + this.SETTINGS.trashFallingAcceleration);
      }
    }
  }

  trashMovingClickInit() {
    const worldHalfWidth = this.cameras.main.width / 2;
    const minimumHeight = this.cameras.main.height * 0.8;

    this.input.on('pointerdown', (pointer) => {
      if (pointer.x > worldHalfWidth && pointer.y < minimumHeight) {
        this.clickMoveDirection = 'right';
      }
      if (pointer.x < worldHalfWidth && pointer.y < minimumHeight) {
        this.clickMoveDirection = 'left';
      }
      if (pointer.y > minimumHeight) {
        this.clickMoveDirection = 'down';
      }
    }, this);

    this.input.on('pointerup', () => {
      this.clickMoveDirection = null;
    }, this);
  }

  trashMovingClickManager(element) {
    if (this.clickMoveDirection) {
      if (this.clickMoveDirection === 'right') {
        if (element.x < this.cameras.main.width) {
          element.x += this.SETTINGS.trashMovingSpeed;
        }
      }
      if (this.clickMoveDirection === 'left') {
        if (element.x > 0) {
          element.x -= this.SETTINGS.trashMovingSpeed;
        }
      }
      if (this.clickMoveDirection === 'down') {
        element.y += this.SETTINGS.trashFallingAcceleration;
      }
    }
  }

  createCountdown() {
    this.countdownForeground = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.3);
    this.countdownForeground.setOrigin(0, 0);
    this.countdownForeground.setDepth(10);

    this.countdownText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 100,
      `${this.countdownInitNumber}`,
      MINIGAME_COUNTDOWN_STYLES);
    this.countdownText.width = 100;
    this.countdownText.setOrigin(0.5, 0.5);
    this.countdownText.setStroke('#FFFFFF', 3);

    this.countdownText.setShadow(3, 3, '#333333', 15, true, false);
    this.countdownText.setDepth(11);

    if (this.allowSoundEffects) {
      this.countdownSound.play();
      let countdownStop = 0;
      this.countdownSoundInterval = setInterval(() => {
        countdownStop++;
        if (countdownStop <= 2) {
          this.countdownSound.play();
        }
      }, 1000);
    }

    this.timeCountdownEvent = this.time.addEvent({
      delay: 1000,
      callback: this.countdownLogic,
      callbackScope: this,
      loop: true,
    });

    this.add.tween({
      targets: this.countdownText,
      duration: 500,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      scale: 1.2,
      yoyo: true,
      repeat: 3,
    });
  }

  countdownLogic() {
    this.countdownInitNumber--;
    this.countdownText.setText(`${this.countdownInitNumber}`);
    if (this.countdownInitNumber === 0) {
      this.timeCountdownEvent.remove();
      this.countdownForeground.destroy();
      this.countdownText.destroy();
      this.startGame();
    }
  }

  checkTrashCollision() {
    if (this.trashElement) {
      for (const container of this.trashContainersArray) {
        const distance = Phaser.Math.Distance.Between(
          this.trashElement.x, this.trashElement.y,
          container.x, container.y,
        );

        if ((this.trashElement.y >= container.y && this.trashElement.y < container.y + 20) && (distance <= container.displayWidth / 2)) {
          container.animateContainerCollision();
          if (container.getData(TRASH_TYPE) === TRASH_CONTAINERS_GAME_TYPES.DOLPHIN) {
            this.createSplash();
            if (this.trashElementType === DOLPHIN_DEFINITION.type) {
              this.dolphinAddition();
              this.initNewTrash();
              break;
            }
          }
          if (container.getData(TRASH_TYPE) === TRASH_CONTAINERS_GAME_TYPES.GIFT) {
            if (this.trashElementType === GIFT_DEFINITION.type) {
              this.giftAddition();
              this.initNewTrash();
              break;
            }
          }
          if (this.trashElementType === container.getData(TRASH_TYPE)) {
            this.scoreAddition(this.trashElementType);
            this.initNewTrash();
            break;
          } else if (this.trashElementType === 'bomb') {
            this.bombDestroy();
            this.livesBombSubtract();
            break;
          } else {
            this.livesSubtract();
            break;
          }
        }
      }
    }
  }

  initNewTrash() {
    if (this.trashElement) {
      this.trashElement.trashDestroy();
    }
    this.trashElement = null;
    this.tube.moveTube();
  }

  scoreAddition(element) {
    if (element === 'paper' || element === 'mixed' || element === 'glass' || element === 'plastic' || element === 'bio') {
      this.score += this.SETTINGS.scoreAdditionValue;
      this.standardTrashesCatched++;
      this.setTotalScore();
      if (this.allowSoundEffects) {
        this.correctSound.play();
      }
    }
  }

  giftAddition() {
    this.giftCatched++;
    this.score += GIFT_PKT;
    this.setTotalScore();
    if (this.allowSoundEffects) {
      this.correctSound.play();
    }
    this.giftIcon.setTexture(MINIGAME_ATLAS, 'gift.png');
  }

  dolphinAddition() {
    this.playerDolphinsCatched++;
    this.setTotalScore();
    this.changeDolphinTextures();
  }

  changeDolphinTextures() {
    this.playerDolphinsArray.forEach((dolphin, index) => {
      if (index + 1 <= this.playerDolphinsCatched) {
        dolphin.setTexture(MINIGAME_ATLAS, 'dolphin.png');
      }
    });
  }

  setTotalScore() {
    this.totalScore = this.score + (this.playerDolphinsCatched * DOLPHIN_PKT);
    this.scoreText.setText(`${this.totalScore}`);
    this.sendCurrentGameState();
    if (this.isFeaturePauseEnabled) {
      this.messageSubject.next({
        action: MINIGAME_EVENTS.PAUSE_ENABLED,
      });
      this.isPauseEnabled = true;
      this.backgroundMusicSound['volume'] = 0;
      this.scene.pause();
    }
  }

  sendCurrentGameState() {
    this.gameStateSubject.next({
      score: this.score,
      totalScore: this.totalScore,
      playerDolphinsCreated: this.playerDolphinsCreated,
      playerDolphinsCatched: this.playerDolphinsCatched,
      timeLeft: this.timeLeft,
      playerLivesNumber: this.playerLivesNumber,
      standardTrashesCatched: this.standardTrashesCatched,
      trashesId: this.trashesId,
      currentTrashIndex: this.currentTrashIndex,
      giftCatched: this.giftCatched,
    });
  }

  livesBombSubtract() {
    this.playerLivesNumber -= 2;
    if (this.playerLivesNumber <= 0) {
      this.playerLivesNumber = 0;
      this.gameOver();
    }
    this.changeLifeBoardTextures();
    this.setTotalScore();
    this.initNewTrash();
  }

  livesSubtract() {
    this.playerLivesNumber--;
    if (this.allowSoundEffects) {
      this.wrongSound.play();
    }
    if (this.playerLivesNumber <= 0) {
      this.playerLivesNumber = 0;
      this.gameOver();
    }
    this.changeLifeBoardTextures();
    this.setTotalScore();
    this.initNewTrash();
  }

  changeLifeBoardTextures() {
    this.playerLivesArray.forEach((live, index) => {
      if (index + 1 > this.playerLivesNumber) {
        live.setTexture(MINIGAME_ATLAS, 'heart-ia.png');
      }
    });
  }

  startGame() {
    this.isGameStarted = true;
    if (this.allowSoundEffects) {
      clearInterval(this.countdownSoundInterval);
      this.backgroundMusicSound.play();
    }
    this.startTimer();
    this.tube.moveTube();
  }

  setConfigAndStartGame = (configValue, minigameState?: MinigameState) => {
    switch (configValue) {
      case 1:
        this.SETTINGS = { ...MINIGAME_SETTINGS };
        break;
      case 2:
        this.SETTINGS = { ...DOLPHIN_SETTINGS };
        break;

      default:
        configValue = 3;
        this.SETTINGS = { ...MINIGAME_SETTINGS };
        break;
    }
    this.createWithSettings(configValue, minigameState);
    this.pauseManager();
  };

  setInitialParams(minigameState?: MinigameState) {
    this.timeLeft = this.SETTINGS.time;
    this.countdownInitNumber = this.SETTINGS.countdownInit;
    this.playerLivesNumber = this.SETTINGS.maxLives;
    this.fallingSpeed = this.SETTINGS.trashFallingSpeed;
    this.timeInit = this.SETTINGS.time;
    this.score = 0;
    this.totalScore = 0;
    this.playerDolphinsCatched = 0;
    this.playerLivesNumber = this.SETTINGS.maxLives;
    this.playerDolphinsCreated = 0;
    this.standardTrashesCatched = 0;
    this.trashesOrderArray = [];
    this.trashesId = [];
    this.currentTrashIndex = 0;
    this.giftCatched = 0;

    if (minigameState) {
      this.score = minigameState.score;
      this.totalScore = minigameState.totalScore;
      this.playerDolphinsCreated = minigameState.playerDolphinsCreated;
      this.playerDolphinsCatched = minigameState.playerDolphinsCatched;
      this.timeLeft = minigameState.timeLeft;
      this.playerLivesNumber = minigameState.playerLivesNumber;
      this.standardTrashesCatched = minigameState.standardTrashesCatched;
      this.timeText.setText(`${this.timeLeft}`);
      this.scoreText.setText(`${this.totalScore}`);
      this.trashesId = minigameState.trashesId;
      this.currentTrashIndex = minigameState.currentTrashIndex;
      this.giftCatched = minigameState.giftCatched;
    }
  }

  createPoolContainer() {
    const poolContainer = new TrashContainer(this, 134, this.cameras.main.height - 84, MINIGAME_ATLAS, TRASH_CONTAINERS_GAME_TYPES.DOLPHIN, 'sorting-pool.png');
    poolContainer.setData(TRASH_TYPE, 'dolphin');
    this.trashContainersArray.push(poolContainer);
  }

  createGiftContainer() {
    const giftContainer = new TrashContainer(this, 676, this.cameras.main.height - 104, MINIGAME_ATLAS, TRASH_CONTAINERS_GAME_TYPES.GIFT, 'sorting-giftbox.png');
    giftContainer.setData(TRASH_TYPE, 'gift');
    giftContainer.setDisplaySize(144, 87);
    this.trashContainersArray.push(giftContainer);
  }

  createDolphinBoard() {
    const dolphinboard = this.add.sprite(133, 20, MINIGAME_ATLAS, 'bar-1.png');
    dolphinboard.setOrigin(0, 0);
    dolphinboard.setDisplaySize(88, 30);
    dolphinboard.setDepth(4);

    let dolphinInitHorizontalValue = 148;
    for (let i = 1; i <= this.SETTINGS.dolphinsAmount; i++) {
      const dolphin = this.add.sprite(dolphinInitHorizontalValue, 25, MINIGAME_ATLAS, 'dolphin-ia.png');
      dolphin.setOrigin(0, 0);
      dolphin.setDepth(5);
      this.playerDolphinsArray.push(dolphin);
      dolphinInitHorizontalValue += 22;
    }
    this.changeDolphinTextures();
  }

  createGiftBoard() {
    const giftBoard = this.add.sprite(130, 20, MINIGAME_ATLAS, 'bar-3.png');
    giftBoard.setOrigin(0, 0);
    giftBoard.setDisplaySize(65, 30);
    giftBoard.setDepth(4);

    this.giftIcon = this.add.sprite(163, 34, MINIGAME_ATLAS, 'gift-ia.png');
    this.giftIcon.setDepth(5);
    if (this.giftCatched > 0) {
      this.giftIcon.setTexture(MINIGAME_ATLAS, 'gift.png');
    }
  }

  bombDestroy() {
    const explosionX = this.trashElement.x;
    const explosionY = this.trashElement.y;
    const explosion = this.add.sprite(explosionX, explosionY, 'explosion').setDisplaySize(160, 160);
    explosion.play('explode');
    if (this.allowSoundEffects) {
      this.bombSound.play();
    }
    this.cameras.main.shake(300);
  }

  trashCrash() {
    const crashX = this.trashElement.x;
    const crashY = this.trashElement.y;
    const crash = this.add.sprite(crashX, crashY, 'crush').setDisplaySize(40, 40);
    crash.play('crash');
  }

  gameOver() {
    this.timeTimerEvent.remove();
    const reasonEndGame = this.checkEndGameReason();
    this.hudScores.next({
      score: this.score,
      playerDolphinsCatched: this.playerDolphinsCatched,
      playerLifes: this.playerLivesNumber,
      reasonEndGame: reasonEndGame,
      standardTrashesCatched: this.standardTrashesCatched,
      giftCatched: this.giftCatched,
    });
    this.scene.pause();
  }

  checkEndGameReason() {
    if (this.timeLeft <= 0) {
      return 'Skończył Ci się czas.';
    } else if (this.playerLivesNumber <= 0) {
      return 'Straciłeś wszystkie życia.';
    }
  }

  changeFallingSpeed() {
    const timeThird = this.timeInit / 3;
    if (this.timeLeft < timeThird * 2) {
      if (this.timeLeft < timeThird) {
        this.fallingSpeed = 2.5;
        this.SETTINGS.trashMovingSpeed = 4;
        return;
      }
      this.fallingSpeed = 1.8;
      this.SETTINGS.trashMovingSpeed = 3.5;
    }
  }

  animationExplode() {
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', {}),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  animationSplash() {
    this.anims.create({
      key: 'splash',
      frames: this.anims.generateFrameNumbers('splash', {}),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  animationCrush() {
    this.anims.create({
      key: 'crash',
      frames: this.anims.generateFrameNumbers('crash', {}),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  createSplash() {
    const splash = this.add.sprite(135, 430, 'splash').setDisplaySize(294, 120);
    splash.play('splash');
    if (this.allowSoundEffects) {
      this.splashSound.play();
    }
  }

  createSoundEffects() {
    this.bombSound = this.sound.add('bomb-sound');
    this.correctSound = this.sound.add('correct-sound');
    this.wrongSound = this.sound.add('wrong-sound');
    this.backgroundMusicSound = this.sound.add('background-sound');
    this.backgroundMusicSound['loop'] = true;
    this.tubeSound = this.sound.add('tube-sound');
    this.splashSound = this.sound.add('splash-sound');
    this.countdownSound = this.sound.add('countdown-sound');
  }
}
