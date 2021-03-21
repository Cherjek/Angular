import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ControlsModule } from 'src/app/controls/ct.module';
import { CoreModule } from 'src/app/core/core.module';
import { TariffMainTaskService } from 'src/app/services/taiff-calculation/export-import-queue/Task/TariffMainTask.service';
import { TariffCalculatorMainFilterService } from 'src/app/services/tariff-calculator/main/filters/tariff-calculator-main-filter.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TariffCalculatorMainFilterComponent } from './components/tariff-calculator-main-filter/tariff-calculator-main-filter.component';
import { TariffCalculatorMainFiltersLogComponent } from './components/tariff-calculator-main-filters-log/tariff-calculator-main-filters-log.component';
import { TariffCalculatorMainFiltersParametersComponent } from './components/tariff-calculator-main-filters-parameters/tariff-calculator-main-filters-parameters.component';
import { MainFilterRoutingModule } from './main-filter.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    MainFilterRoutingModule,
  ],
  declarations: [
    TariffCalculatorMainFilterComponent,
    TariffCalculatorMainFiltersParametersComponent,
    TariffCalculatorMainFiltersLogComponent,
  ],
  providers: [TariffMainTaskService, TariffCalculatorMainFilterService],
})
export class MainFiltersModule {}
