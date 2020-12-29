import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinigameSortingComponent } from './component/minigame-sorting/minigame-sorting.component';

@NgModule({
  declarations: [MinigameSortingComponent],
  imports: [CommonModule],
  exports: [MinigameSortingComponent],
  entryComponents: [MinigameSortingComponent],
})
export class MinigameSortingModule {}
