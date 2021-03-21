import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from '../../additionally-hierarchies/shared/shared.module';
import { OesDayZoneCardMainComponent } from './components/oes-day-zone-card-main/oes-day-zone-card-main.component';
import { OesDayZoneCardPropertyComponent } from './components/oes-day-zone-card-property/oes-day-zone-card-property.component';
import { OesDayZoneCardRoutingModule } from './oes-day-zone.routing.module';
import { DayZonesService } from 'src/app/services/tariff-calculator/day-zone.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    OesDayZoneCardRoutingModule,
  ],
  declarations: [OesDayZoneCardMainComponent, OesDayZoneCardPropertyComponent],
  providers: [DayZonesService],
})
export class OesDayZoneCardPeakModule {}
