import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpectatorRoutingModule } from './spectator-routing.module';
import { SpectatorComponent } from './spectator/spectator.component';
import { TestGameModule } from '../test-game/test-game.module';

@NgModule({
  declarations: [SpectatorComponent],
  imports: [CommonModule, SpectatorRoutingModule, TestGameModule],
})
export class SpectatorModule {}
