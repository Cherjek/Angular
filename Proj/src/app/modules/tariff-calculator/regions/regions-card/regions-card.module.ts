import { RegionsCardTransferComponent } from './components/regions-card-transfer/regions-card-transfer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { RegionsCardPropertyComponent } from './components/regions-card-property/regions-card-property.component';
import { RegionsCardComponent } from './components/regions-card/regions-card.component';
import { RegionsCardRoutingModule } from './regions-card.routing.module';
import { RegionService } from 'src/app/services/tariff-calculator/region.service';
import { OesService } from 'src/app/services/tariff-calculator/oes.service';
import { PriceZoneService } from 'src/app/services/tariff-calculator/price-zone.service';
import { TariffTransferService } from 'src/app/services/tariff-calculator/tariff-transfer.service';
import { TimeZoneService } from 'src/app/services/tariff-calculator/time-zone.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    RegionsCardRoutingModule,
  ],
  declarations: [
    RegionsCardComponent,
    RegionsCardPropertyComponent,
    RegionsCardTransferComponent,
  ],
  providers: [
    RegionService,
    PriceZoneService,
    OesService,
    TariffTransferService,
    TimeZoneService,
  ],
})
export class RegionsCardModule {}
