import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { NotificationsHierarchiesEditRoutingModule } from './notifications-hierarchies-edit.routing.module';
import {
  NotificationsHierarchiesEditComponent } from './components/notifications-hierarchies-edit/notifications-hierarchies-edit.component';
import { NotificationSettingsService } from 'src/app/services/notifications/notification-settings.service';
import {
  HierarchyFilterContainerService } from 'src/app/services/schedules.module/filters-schedule-hierarchy/HierarchyFilterContainer.service';
import { HierarchyDefFiltersService } from 'src/app/services/schedules.module/filters-schedule-hierarchy/HierarchyDefFilters.service';
import { HierarchyAddFiltersService } from 'src/app/services/schedules.module/filters-schedule-hierarchy/HierarchyAddFilters.service';
import {
  ScheduleCardService,
  ScheduleHierarchyService,
} from 'src/app/services/schedules.module';
@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    NotificationsHierarchiesEditRoutingModule,
  ],
  declarations: [NotificationsHierarchiesEditComponent],
  providers: [
    HierarchyAddFiltersService,
    HierarchyDefFiltersService,
    HierarchyFilterContainerService,
    NotificationSettingsService,
    ScheduleCardService,
    ScheduleHierarchyService,
  ],
})
export class NotificationsHierarchiesEditModuleModule {}
