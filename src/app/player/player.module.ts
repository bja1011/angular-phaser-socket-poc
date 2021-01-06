import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player/player.component';
import { PlayerService } from './services/player.service';
import { TestGameModule } from '../test-game/test-game.module';
import { GameModule } from '../game/game.module';

@NgModule({
  declarations: [PlayerComponent],
  imports: [CommonModule, PlayerRoutingModule, TestGameModule, GameModule],
})
export class PlayerModule {}
