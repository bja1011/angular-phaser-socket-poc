export const MINIGAME_TEXT_STYLES = {
  fontSize: 14,
  fontFamily: 'Mplus1cRounded',
  fill: '#FFFFFF',
  fontStyle: 'bold',
};

export const MINIGAME_COUNTDOWN_STYLES = {
  fontSize: 100,
  fontFamily: 'Mplus1cRounded',
  fill: '#FFFFFF',
  fontStyle: 'bold',
  align: 'center',
  fixedWidth: 300,
  fixedHeight: 300,
};

export const TRASH_CONTAINERS_DEFINITIONS = [
  'mixed',
  'plastic',
  'glass',
  'paper',
  'bio',
];

export const TRASH_TYPE = 'trashType';

export const TRASH_CONTAINERS_GAME_TYPES = {
  STANDARD: 'standard',
  DOLPHIN: 'dolphin',
  GIFT: 'gift',
};

export const SORTING_PLATFORMS = [
  [
    {
      name: 'platform_1_1',
      image: 'sorting-trashes-1.png',
      startX: 0,
      startY: 156,
      direction: 'left',
    },
    {
      name: 'platform_1_2',
      image: 'sorting-trashes-1.png',
      startX: 776,
      startY: 156,
      direction: 'left',
    },
  ],
  [
    {
      name: 'platform_2_1',
      image: 'sorting-trashes-2.png',
      startX: 0,
      startY: 390,
      direction: 'right',
    },
    {
      name: 'platform_2_2',
      image: 'sorting-trashes-2.png',
      startX: -792,
      startY: 390,
      direction: 'right',
    },
  ],
];

export const MINIGAME_SETTINGS = {
  sortingPlatformsSpeed: 0.5,
  trashMovingSpeed: 3,
  trashFallingAcceleration: 3,
  tubeMovingSpeed: 1200,
  tubeDelayTime: 500,
  time: 90,
  maxLives: 5,
  trashFallingSpeed: 1,
  countdownInit: 3,
  scoreAdditionValue: 15,
  trashesDefinitions: [
    {
      name: 'trash-bio-1',
      type: 'bio',
      id: 1,
    },
    {
      name: 'trash-bio-2',
      type: 'bio',
      id: 2,
    },
    {
      name: 'trash-bio-3',
      type: 'bio',
      id: 3,
    },
    {
      name: 'trash-bio-4',
      type: 'bio',
      id: 4,
    },
    {
      name: 'trash-bio-5',
      type: 'bio',
      id: 5,
    },
    {
      name: 'trash-bio-6',
      type: 'bio',
      id: 6,
    },
    {
      name: 'trash-bio-7',
      type: 'bio',
      id: 7,
    },
    {
      name: 'trash-bio-8',
      type: 'bio',
      id: 8,
    },
    {
      name: 'trash-bio-9',
      type: 'bio',
      id: 9,
    },
    {
      name: 'trash-glass-1',
      type: 'glass',
      id: 10,
    },
    {
      name: 'trash-glass-2',
      type: 'glass',
      id: 11,
    },
    {
      name: 'trash-glass-3',
      type: 'glass',
      id: 12,
    },
    {
      name: 'trash-glass-4',
      type: 'glass',
      id: 13,
    },
    {
      name: 'trash-glass-5',
      type: 'glass',
      id: 14,
    },
    {
      name: 'trash-glass-6',
      type: 'glass',
      id: 15,
    },
    {
      name: 'trash-glass-7',
      type: 'glass',
      id: 16,
    },
    {
      name: 'trash-glass-8',
      type: 'glass',
      id: 17,
    },
    {
      name: 'trash-mixed-1',
      type: 'mixed',
      id: 18,
    },
    {
      name: 'trash-mixed-2',
      type: 'mixed',
      id: 19,
    },
    {
      name: 'trash-mixed-3',
      type: 'mixed',
      id: 20,
    },
    {
      name: 'trash-mixed-4',
      type: 'mixed',
      id: 21,
    },
    {
      name: 'trash-mixed-5',
      type: 'mixed',
      id: 22,
    },
    {
      name: 'trash-mixed-6',
      type: 'mixed',
      id: 23,
    },
    {
      name: 'trash-mixed-7',
      type: 'mixed',
      id: 24,
    },
    {
      name: 'trash-paper-1',
      type: 'paper',
      id: 25,
    },
    {
      name: 'trash-paper-2',
      type: 'paper',
      id: 26,
    },
    {
      name: 'trash-paper-3',
      type: 'paper',
      id: 27,
    },
    {
      name: 'trash-paper-4',
      type: 'paper',
      id: 28,
    },
    {
      name: 'trash-paper-5',
      type: 'paper',
      id: 29,
    },
    {
      name: 'trash-paper-6',
      type: 'paper',
      id: 30,
    },
    {
      name: 'trash-paper-7',
      type: 'paper',
      id: 31,
    },
    {
      name: 'trash-paper-8',
      type: 'paper',
      id: 32,
    },
    {
      name: 'trash-plastic-1',
      type: 'plastic',
      id: 33,
    },
    {
      name: 'trash-plastic-2',
      type: 'plastic',
      id: 34,
    },
    {
      name: 'trash-plastic-3',
      type: 'plastic',
      id: 35,
    },
    {
      name: 'trash-plastic-4',
      type: 'plastic',
      id: 36,
    },
    {
      name: 'trash-plastic-5',
      type: 'plastic',
      id: 37,
    },
    {
      name: 'trash-plastic-6',
      type: 'plastic',
      id: 38,
    },
    {
      name: 'trash-plastic-7',
      type: 'plastic',
      id: 39,
    },
    {
      name: 'trash-plastic-8',
      type: 'plastic',
      id: 40,
    },
    // {
    //   name: 'trash-bomb',
    //   type: 'bomb',
    // },
  ],
  dolphinsAmount: 0,
};

export const DOLPHIN_SETTINGS = {
  sortingPlatforms: [
    [
      {
        name: 'platform_1_1',
        image: 'platform-1',
        startX: 0,
        startY: 156,
        direction: 'left',
      },
      {
        name: 'platform_1_2',
        image: 'platform-1',
        startX: 776,
        startY: 156,
        direction: 'left',
      },
    ],
    [
      {
        name: 'platform_2_1',
        image: 'platform-2',
        startX: 0,
        startY: 390,
        direction: 'right',
      },
      {
        name: 'platform_2_2',
        image: 'platform-2',
        startX: -792,
        startY: 390,
        direction: 'right',
      },
    ],
  ],
  sortingPlatformsSpeed: 0.5,
  trashMovingSpeed: 3,
  trashFallingAcceleration: 3,
  tubeMovingSpeed: 1200,
  tubeDelayTime: 500,
  time: 90,
  maxLives: 5,
  trashFallingSpeed: 1,
  countdownInit: 3,
  scoreAdditionValue: 15,
  trashesDefinitions: [
    {
      name: 'trash-bio-1',
      type: 'bio',
      id: 1,
    },
    {
      name: 'trash-bio-2',
      type: 'bio',
      id: 2,
    },
    {
      name: 'trash-bio-3',
      type: 'bio',
      id: 3,
    },
    {
      name: 'trash-bio-4',
      type: 'bio',
      id: 4,
    },
    {
      name: 'trash-bio-5',
      type: 'bio',
      id: 5,
    },
    {
      name: 'trash-bio-6',
      type: 'bio',
      id: 6,
    },
    {
      name: 'trash-bio-7',
      type: 'bio',
      id: 7,
    },
    {
      name: 'trash-bio-8',
      type: 'bio',
      id: 8,
    },
    {
      name: 'trash-bio-9',
      type: 'bio',
      id: 9,
    },
    {
      name: 'trash-glass-1',
      type: 'glass',
      id: 10,
    },
    {
      name: 'trash-glass-2',
      type: 'glass',
      id: 11,
    },
    {
      name: 'trash-glass-3',
      type: 'glass',
      id: 12,
    },
    {
      name: 'trash-glass-4',
      type: 'glass',
      id: 13,
    },
    {
      name: 'trash-glass-5',
      type: 'glass',
      id: 14,
    },
    {
      name: 'trash-glass-6',
      type: 'glass',
      id: 15,
    },
    {
      name: 'trash-glass-7',
      type: 'glass',
      id: 16,
    },
    {
      name: 'trash-glass-8',
      type: 'glass',
      id: 17,
    },
    {
      name: 'trash-mixed-1',
      type: 'mixed',
      id: 18,
    },
    {
      name: 'trash-mixed-2',
      type: 'mixed',
      id: 19,
    },
    {
      name: 'trash-mixed-3',
      type: 'mixed',
      id: 20,
    },
    {
      name: 'trash-mixed-4',
      type: 'mixed',
      id: 21,
    },
    {
      name: 'trash-mixed-5',
      type: 'mixed',
      id: 22,
    },
    {
      name: 'trash-mixed-6',
      type: 'mixed',
      id: 23,
    },
    {
      name: 'trash-mixed-7',
      type: 'mixed',
      id: 24,
    },
    {
      name: 'trash-paper-1',
      type: 'paper',
      id: 25,
    },
    {
      name: 'trash-paper-2',
      type: 'paper',
      id: 26,
    },
    {
      name: 'trash-paper-3',
      type: 'paper',
      id: 27,
    },
    {
      name: 'trash-paper-4',
      type: 'paper',
      id: 28,
    },
    {
      name: 'trash-paper-5',
      type: 'paper',
      id: 29,
    },
    {
      name: 'trash-paper-6',
      type: 'paper',
      id: 30,
    },
    {
      name: 'trash-paper-7',
      type: 'paper',
      id: 31,
    },
    {
      name: 'trash-paper-8',
      type: 'paper',
      id: 32,
    },
    {
      name: 'trash-plastic-1',
      type: 'plastic',
      id: 33,
    },
    {
      name: 'trash-plastic-2',
      type: 'plastic',
      id: 34,
    },
    {
      name: 'trash-plastic-3',
      type: 'plastic',
      id: 35,
    },
    {
      name: 'trash-plastic-4',
      type: 'plastic',
      id: 36,
    },
    {
      name: 'trash-plastic-5',
      type: 'plastic',
      id: 37,
    },
    {
      name: 'trash-plastic-6',
      type: 'plastic',
      id: 38,
    },
    {
      name: 'trash-plastic-7',
      type: 'plastic',
      id: 39,
    },
    {
      name: 'trash-plastic-8',
      type: 'plastic',
      id: 40,
    },
    // {
    //   name: 'trash-bomb',
    //   type: 'bomb',
    // },
  ],
  dolphinsAmount: 3,
};

export const BOMB_DEFINITION = {
  name: 'trash-bomb',
  type: 'bomb',
  id: 500,
};

export const DOLPHIN_DEFINITION = {
  name: 'trash-dolphin',
  type: 'dolphin',
  id: 100,
};

export const GIFT_DEFINITION = {
  name: 'trash-gift',
  type: 'gift',
  id: 200,
};

export const MINIGAME_VERSION_STANDARD = 1;
export const MINIGAME_VERSION_DOLPHIN = 2;
export const MINIGAME_VERSION_GIFT = 3;

export const ECO_PKT = 15;
export const DOLPHIN_PKT = 100;
export const LIVE_PKT = 30;
export const GIFT_PKT = 15;

export const MINIGAME_EVENTS = {
  FEATURE_PAUSE_ENABLED: 'feature_pause_enabled',
  PAUSE_ENABLED: 'pause_enabled',
  PAUSE_DISABLED: 'pause_disabled',
};

export const MINIGAME_ATLAS = 'minigame-atlas';

export interface MinigameState {
  score: number;
  totalScore: number;
  playerLivesNumber: number;
  playerDolphinsCreated: number;
  playerDolphinsCatched: number;
  timeLeft: number;
  standardTrashesCatched: number;
  trashesId: number[];
  currentTrashIndex: number;
  giftCatched: number;
}
