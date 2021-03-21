import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, Observable, forkJoin } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { LogicDeviceTypesService } from 'src/app/services/configuration/logic-device-types.service';
import { NotificationSettingsService } from 'src/app/services/notifications/notification-settings.service';
import { INotificationSettings } from 'src/app/services/commands/Models/NotificationSettings';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { PermissionCheck } from 'src/app/core';

@Component({
  selector: 'rom-notifications-card',
  templateUrl: './notifications-card.component.html',
  styleUrls: ['./notifications-card.component.less'],
  providers: [LogicDeviceTypesService],
})
export class NotificationsCardComponent implements OnInit, OnDestroy {
  public notificationName: string;
  public notification: INotificationSettings;
  private notificationId: string | number;
  private sub$: Subscription;
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public contextButtonItems: ContextButtonItem[];
  public menuItems: NavigateItem[] = [
    {
      code: 'property',
      url: 'property',
      name: AppLocalization.Properties,
    },
    {
      code: 'address',
      url: 'address',
      name: AppLocalization.Recipients,
      access: 'ES_NTF_ADDRESSES_VIEW'
    },
    {
      code: 'subsystems',
      url: 'subsystems',
      name: AppLocalization.Subsystems,
      access: 'ES_NTF_SUBSYSTEMS_VIEW'
    },
    {
      code: 'hierachies',
      url: 'hierachies',
      name: AppLocalization.Hierarchy,
      access: 'ES_NTF_HIERARCHY_VIEW'
    },
  ];
  subParam$: Subscription;

  public get isNew() {
    return this.notificationId === 'new';
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private notificationSettingsService: NotificationSettingsService,
    private permissionCheck: PermissionCheck
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.notificationId = param.id;
    });

    this.sub$ = this.notificationSettingsService
      .get(this.notificationId)
      .subscribe((x: INotificationSettings) => {
        this.notification = x;
        this.notificationName = `${this.notification.Name}`;
      });

      this.accessInit()
        .subscribe(results => {
          if (results[0]) {
            this.contextButtonItems = [
              {
                code: 'delete',
                name: AppLocalization.Delete,
                confirm: new ContextButtonItemConfirm(
                  AppLocalization.DeleteConfirm,
                  AppLocalization.Delete
                ),
              },
            ];
          }
        })
    
  }

  ngOnDestroy() {
    this.unsubscriber(this.sub$);
    this.unsubscriber(this.subParam$);
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }

  private accessInit(): Observable<boolean[]> {
    const checkAccess = [
      'ES_NTF_DELETE'
    ];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
      obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
  }

  contextButtonHeaderClick(code: string) {
    this.loadingPanel = true;
    let promise: Promise<any> = null;
    let callback: any;
    if (code === 'delete') {
      promise = this.notificationSettingsService.delete(
        this.notificationId as number
      );
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl('/commands-module/notifications');
        }
      };
    }
    promise
      .then((result: any) => {
        this.loadingPanel = false;
        callback(result);
      })
      .catch((error: any) => {
        this.loadingPanel = false;
        this.headerErrors = [error];
      });
  }
}
