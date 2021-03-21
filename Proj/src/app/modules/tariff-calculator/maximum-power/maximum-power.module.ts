import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { MaximumPowerService } from 'src/app/services/tariff-calculator/maximum-power.service';
import { MaximumPowerRoutingModule } from './maximum-power.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    MaximumPowerRoutingModule,
  ],
  providers: [MaximumPowerService],
})
export class MaximumPowerModule {}
