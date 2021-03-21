import { NotificationsCardHierachiesComponent } from './components/notifications-card-hierachies/notifications-card-hierachies.component';
import { NotificationsCardSubSystemsComponent } from './components/notifications-card-sub-systems/notifications-card-sub-systems.component';
import { NgModule } from '@angular/core';
import { NotificationsCardRoutingModule } from './notifications-card.routing.module';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { NotificationsCardComponent } from './components/notifications-card/notifications-card.component';
import { NotificationsCardPropertyComponent } from './components/notifications-card-property/notifications-card-property.component';
import { NotificationSettingsService } from 'src/app/services/notifications/notification-settings.service';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { ScheduleCardService } from 'src/app/services/schedules.module';
import { NotificationsCardAddressComponent } from './components/notifications-card-address/notifications-card-address.component';
import { SubSystemsService } from 'src/app/services/references/sub-systems.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    NotificationsCardRoutingModule,
  ],
  declarations: [
    NotificationsCardComponent,
    NotificationsCardPropertyComponent,
    NotificationsCardAddressComponent,
    NotificationsCardSubSystemsComponent,
    NotificationsCardHierachiesComponent,
  ],
  providers: [
    NotificationSettingsService,
    ScheduleCardService,
    SubSystemsService,
  ],
})
export class NotificationsCardModule {}
