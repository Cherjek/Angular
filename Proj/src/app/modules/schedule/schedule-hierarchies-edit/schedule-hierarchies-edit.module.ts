import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

import { ScheduleHierarchiesEditRoutingModule } from './schedule-hierarchies-edit-routing.module';
import { ScheduleHierarchiesEditComponent } from './components/schedule-hierarchies-edit.component';

import { HierarchyAddFiltersService } from 'src/app/services/schedules.module/filters-schedule-hierarchy/HierarchyAddFilters.service';
import { HierarchyDefFiltersService } from 'src/app/services/schedules.module/filters-schedule-hierarchy/HierarchyDefFilters.service';
import { HierarchyFilterContainerService } from 'src/app/services/schedules.module/filters-schedule-hierarchy/HierarchyFilterContainer.service';


@NgModule({
  declarations: [ScheduleHierarchiesEditComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    ScheduleHierarchiesEditRoutingModule
  ],
  providers: [HierarchyAddFiltersService, HierarchyDefFiltersService, HierarchyFilterContainerService ]
})
export class ScheduleHierarchiesEditModule { }
