import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  DataGrid,
  DataColumnType,
  ActionButtons,
  ActionButtonConfirmSettings,
  SelectionRowMode as DGSelectionRowMode
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';
import { ContextButtonItem } from '../../../../../controls/ContextButton/ContextButtonItem';

import { ISchedule } from '../../../../../services/schedules.module';
import { SchedulesMainService, ScheduleCardService } from 'src/app/services/schedules.module';
import { SchedulesFilterContainerService } from 'src/app/services/schedules.module/filters-main/SchedulesFilterContainer.service';
import { Router } from '@angular/router';
import * as CommonConstant from '../../../../../common/Constants';
import { Observable, forkJoin } from 'rxjs';
import { PermissionCheck } from 'src/app/core';
const statuses_names = CommonConstant.Common.Constants.ADMIN_MODULE.statuses_names;

@Component({
  selector: 'rom-schedules-main',
  templateUrl: './schedules-main.component.html',
  styleUrls: ['./schedules-main.component.css'],
  providers: [SchedulesMainService, ScheduleCardService]
})
export class SchedulesMainComponent implements OnInit {
  public loadingContent: boolean;
  public errors: any[] = [];
  public deviceTypes: ISchedule[];
  public filterKey: string;
  public commandsActionSchedule: ContextButtonItem[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('cellColumnTemplate', { static: true })
  private cellColumnTemplate: TemplateRef<any>;
  private dgSelectionRowMode = DGSelectionRowMode;

  constructor(
    private permissionCheck: PermissionCheck,
    public scheduleCardService: ScheduleCardService,
    public schedulesFilterContainerService: SchedulesFilterContainerService,
    private schedulesService: SchedulesMainService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.schedulesService
      .getSchedules(this.filterKey)
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (deviceTypes: ISchedule[]) => {
          this.deviceTypes = deviceTypes.map(x => {
            x['ActiveTr'] = x.Active ? statuses_names.active : statuses_names.notActive;
            return x;
          });
          this.initDG();
        },
        error => {
          this.errors = [error];
        }
      );
  }

  private initDG() {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';
    this.dataGrid.SelectionRowMode = this.dgSelectionRowMode.Multiple;

    this.dataGrid.Columns = [
      {
        Name: 'Name',
        Caption: AppLocalization.Name,
        CellTemplate: this.cellColumnTemplate,
        disableTextWrap: true
      },
      {
        Name: 'ActiveTr',
        Caption: AppLocalization.Activity,
        Width: 100
      },
      {
        Name: 'TriggerTypeName',
        Caption: AppLocalization.ScheduleType,
        Width: 150
      },
      {
        Name: 'Hint',
        Caption: AppLocalization.TheTriggerSchedule,
        //disableTextWrap: true
      },
      {
        Name: 'LastStartDate',
        Caption: AppLocalization.LastDate,
        DataType: DataColumnType.DateTime
      },
      {
        Name: 'NextStartDate',
        Caption: AppLocalization.NextTriggerDate,
        DataType: DataColumnType.DateTime
      },
      {
        Name: 'UserGroup',
        AggregateFieldName: ['Name'],
        CellTemplate: this.cellColumnTemplate,
        Caption: AppLocalization.Group
      }
    ];

    this.dataGrid.DataSource = this.deviceTypes;

    this.accessInit().subscribe(result => {
      this.dataGrid.ActionButtons = [];
      if (result[0]) {
        this.dataGrid.ActionButtons.push(
            new ActionButtons(
                'Delete',
                AppLocalization.Delete,
                new ActionButtonConfirmSettings(
                AppLocalization.DeleteSchedulerAlert,
                AppLocalization.Delete
                )
            )
        );
      }
      if (result[1]) {
        this.dataGrid.ActionButtons.push(
          new ActionButtons(
              'active',
              AppLocalization.Activate,
              new ActionButtonConfirmSettings(
              AppLocalization.YoureSureYouWantToActivateYourSchedule,
              AppLocalization.Activate
              )
          )
        );
        this.dataGrid.ActionButtons.push(
            new ActionButtons(
              'deactive',
              AppLocalization.Deactivate,
              new ActionButtonConfirmSettings(
                AppLocalization.YoureSureYouWantToDeactivateYourSchedule,
              AppLocalization.Deactivate
              )
            )
        );
      }
      if (result[2]) {
        this.dataGrid.ActionButtons.push(
          new ActionButtons(
            'start',
            AppLocalization.StartChecking,
            new ActionButtonConfirmSettings(
              AppLocalization.YoureSureYouWantToRunAScheduleCheck,
            AppLocalization.StartChecking
            )
          )
        );
      }
      this.commandsActionSchedule = [];
      if (result[1] && result[3]) {
        this.commandsActionSchedule.push({code: 'active', name: AppLocalization.ActivateSchedules});
        this.commandsActionSchedule.push({code: 'deactive', name: AppLocalization.DeactivateSchedules});
      }
      if (result[2] && result[4]) {
        this.commandsActionSchedule.push({code: 'start', name: AppLocalization.StartChecking});
      }
    });
  }

  private accessInit(): Observable<boolean[]> {

    const checkAccess = [
        'SDL_DELETE',
        'SDL_CHANGE_ACTIVITY',
        'SDL_RUN_TEST',
        'SDL_CHANGE_ACTIVITIES',
        'SDL_RUN_TESTS'
    ];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
        obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
  }

  addNewSchedule() {
    this.router.navigate(['schedule-module/schedule-card/new']);
  }

  onActionButtonClicked(event: any) {
    const itemId = event.item.Id;
    if (event.action === 'delete') {
      this.loadingContent = true;
      this.deleteItem(itemId)
        .then(() => {
          this.dataGrid.DataSource = this.dataGrid.DataSource.filter(
            item => item.Id !== itemId
          );
          this.loadingContent = false;
        })
        .catch((error: any) => {
          this.errors.push(error);
          this.loadingContent = false;
        });
    } else { 
      let request;
      if (event.action === 'active'
      || event.action === 'deactive') {
        request = event.action === 'active' ? 
          this.scheduleCardService.activeSchedule(itemId) :
          this.scheduleCardService.deactiveSchedule(itemId);
      } else if (event.action === 'start') {
        request = this.scheduleCardService.startSchedule(itemId);
      }
      if (request) {
        this.loadingContent = true;
        request.then(() => {
          this.loadingContent = false;
          this.loadData();
        })
        .catch((error: any) => {
          this.errors.push(error);
          this.loadingContent = false;
        });
      }
    }
  }

  private deleteItem(itemId: number) {
    return this.scheduleCardService.deleteSchedule(itemId);
  }

  onApplyFilter(guid: string): void {
    this.filterKey = guid;
    this.loadData();
  }

  itemActionEvent(action: any) {
    let request;
    const ids = (this.dataGrid.getSelectRows() || []).map(x => x.Data.Id);
    if (action.code === 'active') {
      request = this.scheduleCardService.activeSchedules(ids);
    } else if (action.code === 'deactive') {
      request = this.scheduleCardService.deactiveSchedules(ids);
    } else if (action.code === 'start') {
      request = this.scheduleCardService.startSchedules(ids);
    }
    if (request) {
      this.loadingContent = true;
      request.then(() => {
        this.loadingContent = false;
        this.loadData();
      })
      .catch((error: any) => {
        this.errors.push(error);
        this.loadingContent = false;
      });
    }
  }
}
