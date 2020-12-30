import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpectatorRoutingModule } from './spectator-routing.module';
import { SpectatorComponent } from './spectator/spectator.component';


@NgModule({
  declarations: [SpectatorComponent],
  imports: [
    CommonModule,
    SpectatorRoutingModule
  ]
})
export class SpectatorModule { }
