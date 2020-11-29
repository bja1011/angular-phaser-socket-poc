import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinigameSortingComponent } from './component/minigame-sorting/minigame-sorting.component';
import { SharedUiMobileModule } from '../game/game-ui/shared-ui/mobile/shared-ui-mobile.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MinigameSortingComponent],
  imports: [
    CommonModule,
    SharedUiMobileModule,
    // SharedModule
  ],
  exports: [MinigameSortingComponent],
  entryComponents: [MinigameSortingComponent],
})
export class MinigameSortingModule {
}
