import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SubSystemsRoutingModule } from './sub-systems.routing.module';
import { SubSystemsService } from 'src/app/services/references/sub-systems.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SubSystemsRoutingModule,
  ],
  providers: [SubSystemsService],
})
export class SubSystemsModule {}
