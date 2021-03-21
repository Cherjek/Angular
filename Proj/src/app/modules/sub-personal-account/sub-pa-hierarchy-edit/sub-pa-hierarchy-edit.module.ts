import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

import { HierarchyAddFiltersService } from 'src/app/services/schedules.module/filters-schedule-hierarchy/HierarchyAddFilters.service';
import { HierarchyDefFiltersService } from 'src/app/services/schedules.module/filters-schedule-hierarchy/HierarchyDefFilters.service';
import { HierarchyFilterContainerService } from 'src/app/services/schedules.module/filters-schedule-hierarchy/HierarchyFilterContainer.service';
import { SubPaHierarchyEditComponent } from './components/sub-pa-hierarchy-edit/sub-pa-hierarchy-edit.component';
import { SubPaHierarchyEditRoutingModule } from './sub-pa-hierarchy-edit.routing.module';
import { PaSubscriberCardService } from 'src/app/services/sub-personal-account/pa-subscriber-card.service';

@NgModule({
  declarations: [SubPaHierarchyEditComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    SubPaHierarchyEditRoutingModule,
  ],
  providers: [
    HierarchyAddFiltersService,
    HierarchyDefFiltersService,
    HierarchyFilterContainerService,
    PaSubscriberCardService,
  ],
})
export class SubPaHierarchyEditModule {}
