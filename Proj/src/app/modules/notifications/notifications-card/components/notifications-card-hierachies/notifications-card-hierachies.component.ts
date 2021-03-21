import { NotificationSettingsService } from 'src/app/services/notifications/notification-settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DataGrid } from 'src/app/controls/DataGrid';
import { NotificationHierarchySchedule } from 'src/app/services/commands/Models/NotificationHierarchySchedule';

@Component({
  selector: 'rom-notifications-card-hierachies',
  templateUrl: './notifications-card-hierachies.component.html',
  styleUrls: ['./notifications-card-hierachies.component.less'],
})
export class NotificationsCardHierachiesComponent implements OnInit {
  idNotification: number;
  notificationHierarchy: NotificationHierarchySchedule;
  loadingContentPanel = true;
  errorsContentForm: any[] = [];

  @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;

  constructor(
    private notificationsSettingsService: NotificationSettingsService,
    private activedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.idNotification = this.notificationsSettingsService.notificationId = this.activedRoute.parent.snapshot.params.id;

    this.loadNotificationHierarchies();
  }

  changeHierarchies() {
    this.router.navigate([
      `commands-module/notifications-hierarchies-edit/${this.idNotification}`,
    ]);
  }

  private loadNotificationHierarchies() {
    this.notificationsSettingsService
      .getHierarchiesSchedule()
      .pipe(finalize(() => (this.loadingContentPanel = false)))
      .subscribe(
        (data: NotificationHierarchySchedule) => {
          this.notificationHierarchy = data;
        },
        (error) => {
          this.errorsContentForm.push(error);
        }
      );
  }
}
