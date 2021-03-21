import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../../controls/ct.module';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { MainQueueComponent } from './components/main-queue/main-queue.component';
import { MainQueueRoutingModule } from './main-queue.routing.module';
import { MainQueueFilterContainerService } from 'src/app/services/tariff-calculator/main/filters/main-queue-filter-container.service';
import { TariffCalculatorMainAddService } from 'src/app/services/tariff-calculator/main/filters/tariff-calculator-main-add.service';
import { TariffCalculatorMainFilterService } from 'src/app/services/tariff-calculator/main/filters/tariff-calculator-main-filter.service';
import { TariffCalculatorMainService } from 'src/app/services/tariff-calculator/main/filters/tariff-calculator-main.service';

@NgModule({
  declarations: [MainQueueComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    MainQueueRoutingModule,
  ],
  providers: [
    MainQueueFilterContainerService,
    TariffCalculatorMainAddService,
    TariffCalculatorMainFilterService,
    TariffCalculatorMainService,
  ],
})
export class MainQueueModule {}
