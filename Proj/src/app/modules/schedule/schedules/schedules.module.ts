import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulesRoutingModule } from './schedules-routing.module';
import { SchedulesMainComponent } from './components/schedules-main/schedules-main.component';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

import { SchedulesAddFiltersService } from 'src/app/services/schedules.module/filters-main/SchedulesAddFilters.service';
import { SchedulesDefFiltersService } from 'src/app/services/schedules.module/filters-main/SchedulesDefFilters.service';
import { SchedulesFilterContainerService } from 'src/app/services/schedules.module/filters-main/SchedulesFilterContainer.service';

@NgModule({
  declarations: [SchedulesMainComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SchedulesRoutingModule
  ],
  providers: [ SchedulesFilterContainerService, SchedulesAddFiltersService, SchedulesDefFiltersService ]
})
export class SchedulesModule {}
