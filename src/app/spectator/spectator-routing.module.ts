import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpectatorComponent } from './spectator/spectator.component';

const routes: Routes = [
  {
    path: '',
    component: SpectatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpectatorRoutingModule {}
