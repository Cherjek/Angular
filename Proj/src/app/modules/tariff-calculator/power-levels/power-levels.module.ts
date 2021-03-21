import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { PowerLevelsRoutingModule } from './power-levels.routing.module';
import { PowerLevelService } from 'src/app/services/tariff-calculator/power-levels.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    PowerLevelsRoutingModule,
  ],
  providers: [PowerLevelService],
})
export class PowerLevelsModule {}
