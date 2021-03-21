import { TimeZoneService } from './../../../../services/tariff-calculator/time-zone.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { RegionsMainComponent } from './components/regions-main/regions-main.component';
import { RegionsRoutingModule } from './regions.routing.module';
import { RegionService } from 'src/app/services/tariff-calculator/region.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    RegionsRoutingModule,
  ],
  declarations: [RegionsMainComponent],
  providers: [RegionService, TimeZoneService],
})
export class RegionsModule {}
