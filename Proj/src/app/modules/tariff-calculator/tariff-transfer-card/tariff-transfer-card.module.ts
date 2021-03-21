import { TariffTransferService } from 'src/app/services/tariff-calculator/tariff-transfer.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from '../../additionally-hierarchies/shared/shared.module';
import { TariffTransferCardMainComponent } from './components/tariff-transfer-card-main/tariff-transfer-card-main.component';
import { TariffTransferCardPropertyComponent } from './components/tariff-transfer-card-property/tariff-transfer-card-property.component';
import { TariffTransferCardRoutingModule } from './tariff-transfer-card.routing.module';
import { TariffTransferCardFilesComponent } from './components/tariff-transfer-card-files/tariff-transfer-card-files.component';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    TariffTransferCardRoutingModule,
  ],
  declarations: [
    TariffTransferCardMainComponent,
    TariffTransferCardPropertyComponent,
    TariffTransferCardFilesComponent,
  ],
  providers: [TariffTransferService],
})
export class TariffTransferCardModule {}
