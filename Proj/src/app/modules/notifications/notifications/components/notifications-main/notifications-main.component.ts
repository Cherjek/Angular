import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { NotificationSettingsService } from 'src/app/services/notifications/notification-settings.service';
import {
  NotificationSettings,
  INotificationSettings,
} from 'src/app/services/commands/Models/NotificationSettings';
import { IUserGroup } from 'src/app/services/admin.module/admin.group/Models/UserGroup';
import { PermissionCheck } from 'src/app/core';

@Component({
  selector: 'rom-notifications-main',
  templateUrl: './notifications-main.component.html',
  styleUrls: ['./notifications-main.component.less'],
})
export class NotificationsMainComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public notifications: INotificationSettings[];
  public isAdd: boolean;
  public isDelete: boolean;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;
  @ViewChild('userGroupTemplate', { static: true })
  private userGroupTemplate: TemplateRef<IUserGroup>;
  @ViewChild('emailTemplate', { static: true })
  private emailTemplate: TemplateRef<any>;
  @ViewChild('smsTemplate', { static: true })
  private smsTemplate: TemplateRef<any>;
  sub$: Subscription;

  constructor(
    private notificationSettingsService: NotificationSettingsService,
    private router: Router,
    private permissionCheck: PermissionCheck
  ) {}

  ngOnInit() {
    this.accessInit()
      .subscribe(results => {
        this.isAdd = results[0];
        this.isDelete = results[1];
        this.loadData();
      });
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = this.notificationSettingsService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (notifications: NotificationSettings[]) => {
          this.notifications = notifications;
          this.initDG();
        },
        (error) => {
          this.errors = [error];
        }
      );
  }

  private accessInit(): Observable<boolean[]> {
    const checkAccess = [
      'ES_NTF_ADD',
      'ES_NTF_DELETE'
    ];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
      obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
  }

  private initDG() {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';

    this.dataGrid.Columns = [
      {
        Name: 'Name',
        Caption: AppLocalization.Name,
        CellTemplate: this.typeNameColumnTemplate,
        AppendFilter: false,
        disableTextWrap: true,
      },
      {
        Name: 'Description',
        Caption: AppLocalization.Description,
        AppendFilter: false,
        disableTextWrap: true,
      },
      {
        Name: 'UserGroup',
        Caption: AppLocalization.UsersGroups,
        CellTemplate: this.userGroupTemplate,
        AppendFilter: false,
        disableTextWrap: true,
      },
      {
        Name: 'ByEMail',
        Caption: AppLocalization.Label55,
        AppendFilter: false,
        disableTextWrap: true,
        CellTemplate: this.emailTemplate,
        Width: 180,
      },
      {
        Name: 'BySms',
        Caption: AppLocalization.Label54,
        AppendFilter: false,
        disableTextWrap: true,
        CellTemplate: this.smsTemplate,
      },
      {
        Name: 'EMailSubjectPattern',
        Caption: AppLocalization.LetterSubject,
        AppendFilter: false,
        disableTextWrap: true,
      },
      {
        Name: 'EMailBodyPattern',
        Caption: AppLocalization.TextOfTheLetter,
        AppendFilter: false,
        disableTextWrap: true,
      },
      {
        Name: 'SmsTextPattern',
        Caption: AppLocalization.Label103,
        AppendFilter: false,
        disableTextWrap: true,
      },
    ];

    if (this.isDelete) {
      this.dataGrid.ActionButtons = [
        new ActionButtons(
          'Delete',
          AppLocalization.Delete,
          new ActionButtonConfirmSettings(
            AppLocalization.DeleteConfirm,
            AppLocalization.Delete
          )
        ),
      ];
    }

    this.dataGrid.DataSource = this.notifications;
  }

  onActionButtonClicked(event: any) {
    const itemId = event.item.Id;
    this.loadingContent = true;
    this.deleteItem(itemId)
      .then(() => {
        this.dataGrid.DataSource = (this.dataGrid.DataSource || []).filter(
          (item) => {
            if (item) {
              return item.Id !== itemId;
            }
          }
        );
        this.loadingContent = false;
      })
      .catch((error: any) => {
        this.errors.push(error);
        this.loadingContent = false;
      });
  }

  addNewDevice() {
    this.router.navigate(['commands-module/notifications/new']);
  }

  private deleteItem(itemId: number) {
    return this.notificationSettingsService.delete(itemId);
  }
}
