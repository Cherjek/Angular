import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
  SelectionRowMode,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { NotificationSettingsService } from 'src/app/services/notifications/notification-settings.service';
import { SubSystemsService } from 'src/app/services/references/sub-systems.service';
import { SubSystem } from 'src/app/services/references/models/SubSystem';
import { PermissionCheck } from 'src/app/core';

@Component({
  selector: 'rom-notifications-card-sub-systems',
  templateUrl: './notifications-card-sub-systems.component.html',
  styleUrls: ['./notifications-card-sub-systems.component.less'],
})
export class NotificationsCardSubSystemsComponent implements OnInit, OnDestroy {
  loadingContent: boolean;
  errors: any[] = [];
  subsystems: SubSystem[];
  subsystemFilter: SubSystem[];
  public isAdd: boolean;
  public isDelete: boolean;

  @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;

  sub$: Subscription;

  constructor(
    private notificationsSettingsService: NotificationSettingsService,
    private subSystemsService: SubSystemsService,
    private activatedRoute: ActivatedRoute,
    private permissionCheck: PermissionCheck
  ) {
    notificationsSettingsService.notificationId = this.activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.accessInit()
      .subscribe(results => {
        this.isAdd = results[0];
        this.isDelete = results[1];
        this.initDG();
        this.loadData();
      }); 
  }

  onActionButtonClicked(items: any) {
    items = Array.isArray(items) ? items : [items];
    const selectedItems = items.map(
      (x: { item: SubSystem; Data: SubSystem }) => x.item || x.Data
    );
    this.loadingContent = true;
    this.deleteItem(this.filterItems(selectedItems, this.subsystems))
      .then(() => {
        this.loadData();
      })
      .catch((error: any) => {
        this.errors.push(error);
        this.loadingContent = false;
      });
  }

  addFilterItem(selectedValues: SubSystem[]) {
    this.loadingContent = true;
    this.notificationsSettingsService
      .postSubsystems(selectedValues.concat(this.subsystems))
      .then(() => {
        this.loadData();
      })
      .catch((err) => {
        this.loadingContent = false;
        this.errors = [err];
      });
  }

  private accessInit(): Observable<boolean[]> {
    const checkAccess = [
      'ES_NTF_SUBSYSTEMS_ADD',
      'ES_NTF_SUBSYSTEMS_REMOVE'
    ];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
      obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = forkJoin([
      this.notificationsSettingsService.getSubsystems(),
      this.subSystemsService.read(),
    ])
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (data: [SubSystem[], SubSystem[]]) => {
          this.subsystems = data[0];
          this.subsystemFilter = this.filterItems(data[0], data[1]);
          this.dataGrid.DataSource = this.subsystems;
        },
        (error) => {
          this.errors = [error];
        }
      );
  }

  private filterItems(subsystems: SubSystem[], filterSubsystems: SubSystem[]) {
    return filterSubsystems.filter(
      (filterItem) =>
        !subsystems.find((subsystem) => subsystem.Id === filterItem.Id)
    );
  }

  private initDG() {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';
    this.dataGrid.SelectionRowMode = SelectionRowMode.Multiple;
    this.dataGrid.Columns = [
      {
        Name: 'Code',
        Caption: AppLocalization.Code,
        AppendFilter: false,
      },
      {
        Name: 'Name',
        Caption: AppLocalization.Name,
        AppendFilter: false,
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
  }

  private deleteItem(items: any[]) {
    return this.notificationsSettingsService.postSubsystems(items);
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}
