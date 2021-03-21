import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from '../../additionally-hierarchies/shared/shared.module';
import { PriceZonesPeakCardRoutingModule } from './price-zones-peak-card.routing.module';
import { PriceZonesPeakCardMainComponent } from './components/price-zones-peak-card-main/price-zones-peak-card-main.component';
import { PriceZonesPeakCardPropertyComponent } from './components/price-zones-peak-card-property/price-zones-peak-card-property.component';
import { PeakHoursService } from 'src/app/services/tariff-calculator/peak-hours.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    PriceZonesPeakCardRoutingModule,
  ],
  declarations: [
    PriceZonesPeakCardMainComponent,
    PriceZonesPeakCardPropertyComponent,
  ],
  providers: [PeakHoursService],
})
export class PriceZonesCardPeakModule {}
