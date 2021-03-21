import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { TariffCalculationRoutes } from './tariff-calculation.routing';
import { TariffCalculationCreateService } from 'src/app/services/taiff-calculation/tariff-calculation-create/tariff-calculation-create.service';
import { TariffCalculationCreateComponent } from './components/tariff-calculation.component';
import { TariffCalculationTemplateService } from 'src/app/services/taiff-calculation/tariff-calculation-template/tariff-calculation-template.service';
@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    TariffCalculationRoutes
  ],
  declarations: [TariffCalculationCreateComponent],
  providers: [TariffCalculationCreateService, TariffCalculationTemplateService]
})
export class TariffCalculationModule { }
