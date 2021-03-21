import { NotificationsMainComponent } from './components/notifications-main/notifications-main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { NotificationsRoutingModule } from './notifications.routing.module';
import { NotificationSettingsService } from 'src/app/services/notifications/notification-settings.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    NotificationsRoutingModule,
  ],
  declarations: [NotificationsMainComponent],
  providers: [NotificationSettingsService],
})
export class NotificationsModule {}
