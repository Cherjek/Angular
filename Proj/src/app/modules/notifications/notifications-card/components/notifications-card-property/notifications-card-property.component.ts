import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { GlobalValues } from 'src/app/core';
import { ScheduleCardService } from 'src/app/services/schedules.module';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { NotificationSettingsService } from 'src/app/services/notifications/notification-settings.service';
import { INotificationSettings, NotificationSettings } from 'src/app/services/commands/Models/NotificationSettings';

@Component({
  selector: 'rom-notifications-card-property',
  templateUrl: './notifications-card-property.component.html',
  styleUrls: ['./notifications-card-property.component.less'],
})
export class NotificationsCardPropertyComponent implements OnInit, OnDestroy {
  loadingContent: boolean;
  errors: any[] = [];
  errorLoadEntity: any;
  isPropEdit = false;
  loadingContentPanel = false;
  properties: IEntityViewProperty[];

  private propertiesClone: IEntityViewProperty[];
  private idNotification: number | string;
  private paramSub$: Subscription;
  private sub$: Subscription;
  private userGroup$: Subscription;

  public get isNew() {
    return this.idNotification === 'new';
  }

  constructor(
    private notificationsSettingsService: NotificationSettingsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private scheduleCardService: ScheduleCardService
  ) {
    this.paramSub$ = this.activatedRoute.parent.params.subscribe((params) => {
      this.idNotification = params.id;

      this.loadDevices();
    });
  }

  ngOnInit() {
    if (this.isNew) {
      this.isPropEdit = true;
    }
  }

  ngOnDestroy() {
    [this.userGroup$, this.paramSub$, this.sub$].forEach((sub) =>
      this.unsubscriber(sub)
    );
  }

  private initProperties(notification: INotificationSettings) {
    this.properties = [
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: notification.Name,
        IsRequired: true,
      },
      {
        Code: 'Description',
        Name: AppLocalization.Description,
        Type: 'String',
        Value: notification.Description,
      },
      {
        Code: 'UserGroup',
        Name: AppLocalization.Group,
        Type: 'Option',
        Value: notification.UserGroup,
        IsRequired: true,
      },
      {
        Code: 'BySms',
        Name: 'SMS',
        Type: 'Bool',
        Value: notification.BySms,
      },
      {
        Code: 'SmsTextPattern',
        Name: AppLocalization.SettingsSms,
        Type: 'MultiString',
        Value: notification.SmsTextPattern,
        TextPrecede: AppLocalization.Label102,
      },
      {
        Code: 'ByEMail',
        Name: 'Email',
        Type: 'Bool',
        Value: notification.ByEMail,
      },
      {
        Code: 'EMailSubjectPattern',
        Name: AppLocalization.SetupMail,
        Type: 'MultiString',
        Value: notification.EMailSubjectPattern,
        TextPrecede: AppLocalization.TempSubjectLetter,
      },
      {
        Code: 'EMailBodyPattern',
        Name: '',
        Type: 'MultiString',
        Value: notification.EMailBodyPattern,
        TextPrecede: AppLocalization.TempTextLetter,
      },
    ];
  }

  navigateBack() {
    GlobalValues.Instance.Page.backwardButton.navigate();
  }

  cancel() {
    this.errors = [];
    if (this.isNew) {
      this.navigateBack();
    } else {
      this.cancelChangeProperty(false);
      this.updateToggleContent();
    }
  }

  updateToggleContent() {
    const codeObj: any = {};
    this.properties.forEach((prop) => {
      codeObj[prop.Code] = prop;
    });
    this.toggler(codeObj.BySms, [codeObj.SmsTextPattern]);

    this.toggler(codeObj.ByEMail, [
      codeObj.EMailSubjectPattern,
      codeObj.EMailBodyPattern,
    ]);
  }

  eventDropDown(sender: any, prop: IEntityViewProperty) {
    if (sender.event === 'LOAD_TRIGGER' || sender.event === 'SELECT') {
      this.optionControlDropDown({
        control: sender,
        property: prop,
        properties: this.propertiesClone,
      });
    }
  }

  optionControlDropDown(event: any) {
    const property = event.property;
    this.userGroup$ = this.loadUserGroups().subscribe(
      (groups: any) => {
        property.arrayValues = groups;
      },
      (error: any) => (this.errors = [error])
    );
  }

  private loadUserGroups() {
    if (this.scheduleCardService.userGroupsCache) {
      return this.scheduleCardService.userGroupsCache;
    } else {
      this.scheduleCardService.userGroupsCache = this.scheduleCardService.getUserGroups();
      return this.scheduleCardService.userGroupsCache;
    }
  }

  save() {
    this.errors = [];
    const notification = new NotificationSettings();
    if (!this.isNew) {
      notification.Id = this.idNotification as number;
    }
    this.properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      notification[prop.Code] = prop.Value;
    });
    if (!notification.Name) {
      this.errors = [AppLocalization.YouNeedToSetAName];
      return;
    }
    if (!notification.UserGroup) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.Group}"`];
      return;
    }
    this.loadingContent = true;
    this.notificationsSettingsService
      .post(notification)
      .then((notificationId) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + notificationId], {
            relativeTo: this.activatedRoute,
          });
        } else {
          this.loadDevices();
        }

        this.cancelChangeProperty();
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  private loadDevices() {
    this.loadingContent = true;
    this.sub$ = this.notificationsSettingsService
      .get(this.idNotification)
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: INotificationSettings) => {
          this.initProperties(data);
          this.propertiesClone = this.properties.map((prop) => ({ ...prop }));
          this.updateToggleContent();
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private toggler(
    button: IEntityViewProperty,
    toggleItems: IEntityViewProperty[]
  ) {
    const hideItems = (state: boolean) =>
      toggleItems.forEach((item) => (item.IsNotShown = state));
    if (button && button.Value === true) {
      hideItems(false);
    } else {
      hideItems(true);
    }
  }

  private cancelChangeProperty(isSaved = true) {
    if (!isSaved) {
      this.properties = this.propertiesClone.map((x) => ({ ...x }));
    }
    this.isPropEdit = false;
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}
