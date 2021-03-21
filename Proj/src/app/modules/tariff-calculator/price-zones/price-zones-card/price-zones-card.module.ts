import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { PriceZonesCardPropertyComponent } from './components/price-zones-card-property/price-zones-card-property.component';
import { PriceZonesCardComponent } from './components/price-zones-card/price-zones-card.component';
import { PriceZonesCardRoutingModule } from './price-zones-card.routing.module';
import { PriceZoneService } from 'src/app/services/tariff-calculator/price-zone.service';
import { PriceZonesCardPeaksComponent } from './components/price-zones-card-peaks/price-zones-card-peaks.component';
import { PeakHoursService } from 'src/app/services/tariff-calculator/peak-hours.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    PriceZonesCardRoutingModule,
  ],
  declarations: [
    PriceZonesCardComponent,
    PriceZonesCardPropertyComponent,
    PriceZonesCardPeaksComponent,
  ],
  providers: [PriceZoneService, PeakHoursService],
})
export class PriceZonesCardModule {}
