import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from '../../additionally-hierarchies/shared/shared.module';
import { LogicDeviceTariffHistoryCardMainComponent } from './components/logic-device-tariff-history-card-main/logic-device-tariff-history-card-main.component';
import { LogicDeviceTariffHistoryCardPropertyComponent } from './components/logic-device-tariff-history-card-property/logic-device-tariff-history-card-property.component';
import { LogicDeviceTariffHistoryCardRoutingModule } from './logic-device-tariff-history-card.routing.module';
import { TariffHistoryService } from 'src/app/services/tariff-calculator/tariff-history.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    LogicDeviceTariffHistoryCardRoutingModule,
  ],
  declarations: [
    LogicDeviceTariffHistoryCardMainComponent,
    LogicDeviceTariffHistoryCardPropertyComponent,
  ],
  providers: [TariffHistoryService],
})
export class LogicDeviceTariffHistoryCardModule {}
