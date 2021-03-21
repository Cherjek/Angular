import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { PriceZoneRoutingModule } from './price-zone.routing.module';
import { PriceZoneMainComponent } from './components/price-zone-main/price-zone-main.component';
import { PriceZoneService } from 'src/app/services/tariff-calculator/price-zone.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    PriceZoneRoutingModule,
  ],
  declarations: [PriceZoneMainComponent],
  providers: [PriceZoneService],
})
export class PriceZoneModule {}
