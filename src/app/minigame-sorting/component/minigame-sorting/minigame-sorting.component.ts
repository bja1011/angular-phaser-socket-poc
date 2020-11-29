import { Component, OnDestroy, OnInit } from '@angular/core';
// import { GameService } from '../../../game/services/game.service';
import MinigamePreloadScene from '../../scenes/Minigame.preload.scene';
import Minigame from '../../classes/Minigame.class';
import MinigameStartScene from '../../scenes/Minigame.start.scene';
// import { OwInject } from '../../../../core/decorators/ow-inject.decorator';
// import { DialogService } from '../../../shared/providers/dialog.service';
import {
  DOLPHIN_PKT,
  ECO_PKT,
  GIFT_PKT,
  LIVE_PKT,
  MINIGAME_EVENTS,
  MINIGAME_VERSION_DOLPHIN,
  MINIGAME_VERSION_STANDARD,
  MinigameState
} from '../../config/minigame-config';
// import { AbstractInjectBaseComponent } from '../../../../core/abstracts/abstract-inject-base.component';
// import { select, Store } from '@ngrx/store';
// import { PlayerSelectors } from '../../../../store/player';
// import { AppState } from '../../../../store/state';
// import { unsubscribeObject } from '../../../../core/utility/unsubscribe-array';
// import { ProductPlayerService } from '../../../player/providers/product-player.service';
// import { ProductDetails, ProductDetailsBalance } from '../../../player/interfaces/product.interface';
import { TrashGameService } from '../../services/trash-game.service';
// import { Player } from '../../../player/interfaces/player';
// import { WfMinigameRankListComponent } from '../../../game/game-ui/hud/custom/basic/dialogs/wf-minigame-rank/wf-minigame-rank-list/wf-minigame-rank-list.component';
import NO_ZOOM = Phaser.Scale.NO_ZOOM;

@Component({
  selector: 'app-minigame-sorting',
  templateUrl: './minigame-sorting.component.html',
  styleUrls: ['./minigame-sorting.component.scss']
})
export class MinigameSortingComponent implements OnInit, OnDestroy {
  isCC = false;
  player: any;

  isGameLoaded: boolean;
  isFeaturePauseEnabled: boolean;
  isPauseEnabled: boolean;
  productTrash8000: any;
  productTrashDolphin8001: any;

  currentGame: {
    game_id: number;
    token: string;
    started_at: string;
    type: number;
    progress: MinigameState;
  };

  minigameState: MinigameState;

  DOLPHIN_PKT = DOLPHIN_PKT;
  ECO_PKT = ECO_PKT;
  LIVE_PKT = LIVE_PKT;
  GIFT_PKT = GIFT_PKT;

  HUD_TEMPLATES = {
    WELCOME: 'welcome',
    SELECT_GAME: 'select-game',
    SELECT_GAME_GIFT: 'select-game-gift',
    RULES_GAME: 'rules-game',
    SCORES_GAME: 'scores-game',
    CONTINUE_GAME: 'continue-game',
    PAUSE_GAME: 'pause-game',
  };
  activeHudTemplate: string;
  isHideHud: boolean;
  isShowTooltipInfo: boolean;
  scores: {
    score: number;
    playerDolphinsCatched: number;
    playerLifes: number;
    standardTrashesCatched: number;
    reasonEndGame: string;
    giftCatched: number;
  };

  scoresCalculated: {
    standardTrashesCatched: number;
    playerDolphinsCatched: number;
    arrayDolphins: number[];
    playerLifes: number;
    arrayLifes: number[];
    totalPrize: number;
    totalScore: number;
    giftCatched: number;
  };

  game;
  config = {
    type: Phaser.AUTO,
    width: 820,
    height: 570,
    parent: 'minigame',
    backgroundColor: 0xBFCDD7,
    zoom: NO_ZOOM,
    scene: [
      MinigamePreloadScene,
      MinigameStartScene,
    ],
    physics: {
      default: 'arcade',
      arcade: {
        debug: true
      }
    }
  };

  subs = {
    player: null,
  };

  PRODUCT_CATEGORY_GIFT = 11;
  countProductsGift = 0;
  productGiftDefinitions: any[] = [];
  productGiftBalances: Array<any & { balance: number, balancePlus100: number }> = [];

  constructor(private trashGameService: TrashGameService) {
  }

  ngOnInit() {
    this.game = new Minigame(this.config, this.gameService);
    this.subscribeGameLoaded();
    this.changeTemplate(this.HUD_TEMPLATES.WELCOME);
    this.subscribePlayer();
  }

  productsPlayer() {
    this.productPlayerService.productsPlayer({
      category: this.PRODUCT_CATEGORY_GIFT,
    })
      .subscribe((resp) => {
        this.productGiftDefinitions = resp;
        this.setProductsGift();
      });
  }

  subscribeGameLoaded() {
    this.game.isGameLoaded.subscribe((isGameLoaded: boolean) => {
      if (isGameLoaded) {
        this.getUnfinished();
      }
      this.isGameLoaded = isGameLoaded;
    });
  }

  subscribePlayer() {
    this.subs.player = this.store
      .pipe(
        select(PlayerSelectors.selectPlayer),
      )
      .subscribe((player) => {
        this.player = player;
        this.setProductsTrash();
        this.setProductsGift();
      });
  }

  getUnfinished() {
    this.trashGameService.getUnfinished()
      .subscribe((resp) => {
        this.currentGame = resp;

        if (this.currentGame) {
          this.changeTemplate(this.HUD_TEMPLATES.CONTINUE_GAME);
        }
      }, (errResp) => {
        // this.dialogService.openAlertErrorApi({errResp});
      });
  }

  postTypeStart(type: number) {
    this.trashGameService.postTypeStart(type)
      .subscribe((resp) => {
        this.currentGame = resp;
        this.startGame();
      }, (errResp) => {
        this.dialogService.openAlertErrorApi({errResp});
      });
  }

  postFinish() {
    const progress = this.encodeData({
      ...this.minigameState,
      prize: this.scoresCalculated.totalPrize,
    });

    this.trashGameService.postFinish(this.currentGame.game_id, progress)
      .subscribe(() => {
        this.currentGame = null;
      }, (errResp) => {
        this.dialogService.openAlertErrorApi({errResp});
      });
  }

  postProgress() {
    const progress = this.encodeData(this.minigameState);

    this.trashGameService.postResult(this.currentGame.game_id, progress)
      .subscribe();
  }

  encodeData(data) {
    const base = btoa(JSON.stringify(data));
    return encodeURIComponent(`${this.currentGame.token}${base}`);
  }

  setProductsTrash() {
    this.productTrash8000 = this.productPlayerService.getProduct({product_id: 8000});
    this.productTrashDolphin8001 = this.productPlayerService.getProduct({product_id: 8001});
  }

  setProductsGift() {
    this.productGiftBalances = [];

    this.productGiftBalances = this.productGiftDefinitions.map((productGiftDefinition) => {
      const productGiftBalance = this.player.product_balances.find((productGift) => {
        return productGift.product_id === productGiftDefinition.product_id;
      });

      const balance = productGiftBalance ? productGiftBalance.balance : 0;

      const productGiftBalancePlus100 = this.player.product_balances.find((productGift) => {
        return productGift.product_id === productGiftDefinition.product_id + 100;
      });

      const balancePlus100 = productGiftBalancePlus100 ? productGiftBalancePlus100.balance : 0;

      return {
        ...productGiftDefinition,
        balance,
        balancePlus100,
      };
    });

    this.countProductsGift = this.productGiftBalances.reduce((balance, productGift) => {
      return balance + productGift.balance;
    }, 0);
  }

  resetGame() {
    this.clearScores();
    this.game.destroy(true);
    this.game = new Minigame(this.config, this.gameService);
    this.changeTemplate(this.HUD_TEMPLATES.WELCOME);
  }

  closeGame() {
    this.dialogService.closeAll();
  }

  resumeGame() {
    this.game.scene.scenes[1].resumeGame();
  }

  startStandardGame() {
    this.postTypeStart(MINIGAME_VERSION_STANDARD);
  }

  startDolphinGame() {
    this.postTypeStart(MINIGAME_VERSION_DOLPHIN);
  }

  startGiftGame(productId: number) {
    this.postTypeStart(productId);
  }

  continueGame() {
    this.startGame();
  }

  startGame() {
    this.game.scene.scenes[1].setConfigAndStartGame(this.currentGame.type, this.currentGame.progress);
    this.isHideHud = true;

    this.game.scene.scenes[1].hudScores.subscribe((scores) => {
      this.scores = scores;
      this.calcScores();
      this.changeTemplate(this.HUD_TEMPLATES.SCORES_GAME);
      this.isHideHud = false;
    });

    this.game.scene.scenes[1].gameStateSubject.subscribe((minigameState: MinigameState) => {
      this.minigameState = minigameState;
      this.postProgress();
    });

    this.game.scene.scenes[1].messageSubject.subscribe((eventObject: { action: string, value?: any }) => {
      switch (eventObject.action) {
        case MINIGAME_EVENTS.FEATURE_PAUSE_ENABLED:
          this.isFeaturePauseEnabled = true;
          break;

        case MINIGAME_EVENTS.PAUSE_DISABLED:
          this.isPauseEnabled = false;
          this.isFeaturePauseEnabled = false;
          this.isHideHud = true;
          break;

        case MINIGAME_EVENTS.PAUSE_ENABLED:
          this.isPauseEnabled = true;
          this.isFeaturePauseEnabled = false;
          this.isHideHud = false;
          this.changeTemplate(this.HUD_TEMPLATES.PAUSE_GAME);
          break;
      }
    });
  }

  clearScores() {
    this.scores = null;
    this.scoresCalculated = null;
  }

  calcScores() {
    const standardTrashesCatched = this.scores.standardTrashesCatched * this.ECO_PKT;
    const playerDolphinsCatched = this.scores.playerDolphinsCatched * this.DOLPHIN_PKT;
    const giftCatched = (this.scores.giftCatched || 0) * this.GIFT_PKT;
    const playerLifes = this.scores.playerLifes * this.LIVE_PKT;
    const arrayDolphins = new Array(this.scores.playerDolphinsCatched).fill(1);
    const arrayLifes = new Array(this.scores.playerLifes).fill(1);

    const totalScore = standardTrashesCatched + playerDolphinsCatched + playerLifes + giftCatched;

    const totalPrize = totalScore;

    this.scoresCalculated = {
      playerDolphinsCatched,
      arrayDolphins,
      playerLifes,
      arrayLifes,
      totalScore,
      totalPrize,
      standardTrashesCatched,
      giftCatched
    };

    this.postFinish();
  }

  changeTemplate(template) {
    this.activeHudTemplate = template;

    if (this.activeHudTemplate === this.HUD_TEMPLATES.SELECT_GAME) {
      this.productsPlayer();
    }
  }

  openProductInfo(text: string) {
    this.dialogService.openAlert({
      description: text,
      style: {
        maxWidth: '750px',
      }
    });
  }

  openWfMinigameRankList() {
    this.dialogService.open(WfMinigameRankListComponent);
  }

  ngOnDestroy() {
    unsubscribeObject(this.subs);
    this.game.destroy(true);
  }
}
