import { OesCardDayZonesComponent } from './components/oes-card-day-zones/oes-card-day-zones.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { OesCardPropertyComponent } from './components/oes-card-property/oes-card-property.component';
import { OesCardComponent } from './components/oes-card/oes-card.component';
import { OesCardRoutingModule } from './oes-card.routing.module';
import { OesService } from 'src/app/services/tariff-calculator/oes.service';
import { DayZonesService } from 'src/app/services/tariff-calculator/day-zone.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    OesCardRoutingModule,
  ],
  declarations: [
    OesCardComponent,
    OesCardPropertyComponent,
    OesCardDayZonesComponent,
  ],
  providers: [OesService, DayZonesService],
})
export class OesCardModule {}
